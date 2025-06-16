const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi input dasar
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user baru
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Buat token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Registrasi berhasil',
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            token
        });
    } catch (err) {
        console.error('Error saat registrasi:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Ambil setelah "Bearer "

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid' });
        }

        req.user = user; // userId dan email masuk sini
        next();
    });
};

module.exports = authenticateToken;


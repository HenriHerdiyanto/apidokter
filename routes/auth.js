const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Ganti ini dengan secret yang aman di env file
const JWT_SECRET = 'rahasia_super_aman';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Email tidak ditemukan' });
        }

        // Bandingkan password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
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

        // Buat token langsung jika mau langsung login setelah register
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'Registrasi berhasil', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan saat register' });
    }
});

module.exports = router;

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan di header' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Gagal verifikasi token:', err.message);
            return res.status(403).json({ message: 'Token tidak valid', error: err.message });
        }

        req.user = user; // Berisi userId dan email dari token
        next();
    });
};

module.exports = authenticateToken;

require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');

const jadwalRoutes = require('./routes/jadwalRoutes');

// Middleware
app.use(express.json());

// Prefix semua endpoint jadwal dengan /api
app.use('/api/jadwal', jadwalRoutes);
app.use('/api', authRoutes);

// Sync DB & Start server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database & tabel berhasil disinkronisasi');
    app.listen(3000, () => {
        console.log('Server berjalan di http://localhost:3000');
    });
}).catch(err => {
    console.error('Gagal sinkron:', err);
});

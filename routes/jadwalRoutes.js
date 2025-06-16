const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwalController'); // <-- Tambahkan ini
const authenticateToken = require('../middleware/authMiddleware');

// Contoh penggunaan
router.get('/', jadwalController.getJadwalDokter);
router.post('/', jadwalController.buatJadwalDokter);

module.exports = router;

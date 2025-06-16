const { Jadwal, Dokter } = require('../models'); // ⬅️ ini otomatis bawa relasi

const { Op } = require('sequelize');

// Mapping nama hari ke index JS
const hariIndex = {
    "senin": 1,
    "selasa": 2,
    "rabu": 3,
    "kamis": 4,
    "jumat": 5,
    "sabtu": 6,
    "minggu": 0
};

exports.buatJadwalDokter = async (req, res) => {
    try {
        const { doctor_id, day, time_start, time_finish, quota, status, date_range } = req.body;

        if (!doctor_id || !day || !time_start || !time_finish || !quota || !date_range?.start || !date_range?.end) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        const startDate = new Date(date_range.start);
        const endDate = new Date(date_range.end);

        const targetDay = hariIndex[day.toLowerCase()];
        if (targetDay === undefined) {
            return res.status(400).json({ message: "Hari tidak valid" });
        }

        const jadwalList = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (d.getDay() === targetDay) {
                jadwalList.push({
                    doctor_id,
                    day,
                    time_start,
                    time_finish,
                    quota,
                    status: status === true || status === "true",
                    date_range: new Date(d)
                });
            }
        }

        if (jadwalList.length === 0) {
            return res.status(400).json({ message: "Tidak ada jadwal yang cocok dengan hari dan tanggal yang diberikan" });
        }

        await Jadwal.bulkCreate(jadwalList);
        res.status(201).json({ message: "Jadwal berhasil dibuat", total: jadwalList.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};


exports.getJadwalDokter = async (req, res) => {
    try {
        const jadwal = await Jadwal.findAll();

        const formatted = jadwal.map(j => ({
            id: j.id,
            doctor_id: j.doctor_id,
            day: j.day,
            date_range: j.date_range ? j.date_range.toISOString().split('T')[0] : null,
            time_start: j.time_start,
            time_finish: j.time_finish,
            quota: j.quota,
            status: j.status
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error('Gagal mengambil data jadwal dokter:', err);
        res.status(500).json({ message: 'Gagal mengambil data jadwal dokter', error: err.message });
    }
};

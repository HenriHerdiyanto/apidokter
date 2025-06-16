const Jadwal = require('./jadwal');
const Dokter = require('./dokter');
const User = require('./user');

Dokter.hasMany(Jadwal, { foreignKey: 'doctor_id' });
Jadwal.belongsTo(Dokter, { foreignKey: 'doctor_id' });

module.exports = { Jadwal, Dokter, User };
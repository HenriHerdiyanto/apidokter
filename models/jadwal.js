const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jadwal = sequelize.define('jadwal_dokter', {
    doctor_id: DataTypes.INTEGER,
    day: DataTypes.STRING,
    time_start: DataTypes.STRING,
    time_finish: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    date_range: DataTypes.DATE
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = Jadwal;

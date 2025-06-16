const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dokter = sequelize.define('dokter', {
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = Dokter;

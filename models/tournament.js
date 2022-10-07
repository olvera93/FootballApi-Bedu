const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Tournament = sequelize.define('Tournament', {
    id_tournament: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    tournamentName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    startDate: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    endDate: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    winner: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },

    typeTourment: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
})
    

module.exports = Tournament
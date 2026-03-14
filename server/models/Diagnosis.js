const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Diagnosis = sequelize.define('Diagnosis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  visitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Visits',
      key: 'id'
    }
  }
});

module.exports = Diagnosis;
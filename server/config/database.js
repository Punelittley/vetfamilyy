const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '..', process.env.DB_FILE || 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  define: {
    timestamps: true, 
    underscored: true 
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('База данных SQLite подключена успешно');
    
    await sequelize.query('PRAGMA foreign_keys = ON');
    console.log('Foreign keys включены');
    
    await sequelize.sync({ alter: false });
    console.log('Модели синхронизированы');
  } catch (error) {
    console.error('Ошибка подключения к БД:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
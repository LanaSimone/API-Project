const {Sequelize, col} = require('sequelize');
const config = require('./index');

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: config.dbFile,
// });

// // Enable foreign key constraints for SQLite
// sequelize.query('PRAGMA foreign_keys = ON;')
//   .then(() => {
//     console.log('Foreign key constraints are enabled');
//   })
//   .catch((error) => {
//     console.error('Error enabling foreign key constraints:', error);
//   });

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
    logging: console.log,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA,
    }
  }
};

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all model files in the directory and initialize them
fs.readdirSync(__dirname)
    .filter(file => {
      return (
          file.indexOf('.') !== 0 &&  // Exclude hidden files
          file !== basename &&        // Exclude this file (index.js)
          file.slice(-3) === '.js'    // Include only JavaScript files
      );
    })
    .forEach(file => {
      // Import and initialize each model
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

      // Check and log any potential issues with model names
      if (!model.name) {
        console.error(`Model at ${file} does not have a valid name.`);
        return;
      }

      // Assign model to db object
      db[model.name] = model;
    });

// Set up associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize connection and Sequelize class
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

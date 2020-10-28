// runs code in strict mode which allows for secure javaScript
'use strict';
// require fs means allows to read files on the computer
var fs        = require('fs');
//The Path module provides a way of working with directories and file paths.
var path      = require('path');
//creates a sequelize instance
var Sequelize = require('sequelize');
// filename part of path
var basename  = path.basename(module.filename);
// environment and development is the defult 
var env       = process.env.NODE_ENV || 'development';
// So it can access env
var config    = require(__dirname + '/../config/config.json')[env];
// stores the mofles for the databse
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
// gets all files in directory
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

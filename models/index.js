"use strict";
/**
 * this class will import the models associated with the DB and expose anything that will be needed for raw queryies and ENUMS types
 */
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var config = require('config');

var fs = require('fs');
var db = {};
var sequelize = new Sequelize(config.get('connection'));
fs.readdirSync(__dirname).filter(function (file) { //standard boiler plate for finding the models
    return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});
sequelize.authenticate().then(function () {
    return sequelize.sync();
}).catch(function (error) {
    console.log('An error has occurred: '+ JSON.stringify(error)+'\n\n Terminating process');
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

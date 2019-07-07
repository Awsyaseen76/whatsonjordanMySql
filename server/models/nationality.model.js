var Sequelize = require('sequelize');
var db = require('../database');

var Nationality = db.sequelize.define('nationality', {
    nationality: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

module.exports = Nationality;
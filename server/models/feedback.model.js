var Sequelize = require('sequelize');
var db = require('../database');

var Feedback = db.sequelize.define('feedback', {
    details: {
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

module.exports = Feedback;
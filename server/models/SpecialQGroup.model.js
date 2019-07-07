var Sequelize = require('sequelize');
var db = require('../databse');

var SpecialQGroup = db.sequelize.define('specialQGroup', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    organizerId: {
        type: Sequelize.STRING,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
})

module.exports = SpecialQGroup;
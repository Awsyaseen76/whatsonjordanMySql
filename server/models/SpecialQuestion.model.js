var Sequelize = require('sequelize');
var db = require('../database');

var SpecialQuestion = db.sequelize.define('specialQuestion', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    required: {
        type: Sequelize.BOOLEAN
    },
    type: {
        type: Sequelize.ENUM,
        values: ['textbox', 'select', 'checkbox']
    },
    title: {
        type: Sequelize.STRING
    },
    options:{
        type: Sequelize.JSON
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

module.exports = SpecialQuestion;
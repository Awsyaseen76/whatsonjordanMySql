var Sequelize = require('sequelize');
var db = require('../database');
var SQAnswer = db.sequelize.define('sQAnswer', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    questionID: {
        type: Sequelize.STRING
    },
    answer: {
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
}, {
    freezeTableName: true,
        tableName: 'sQAnswer'});
module.exports = SQAnswer;

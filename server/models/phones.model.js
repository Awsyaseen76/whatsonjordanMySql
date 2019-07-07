var Sequelize = require('sequelize');
var db = require('../database');
var Phones = db.sequelize.define('phone', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    type: {
        type: Sequelize.ENUM,
        values: ['Mobile', 'Landline', 'Emergency']
    },
    number: {
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
    // phone:{
    //     type: Sequelize.STRING
    // },
    // fatherPhone:{
    //     type: Sequelize.STRING
    // },
    // motherPhone: {
    //     type: Sequelize.STRING
    // },
    // emergency:{
    //     type: Sequelize.STRING
    // },
    // phone1: {
    //     type: Sequelize.STRING
    // },
    // phone2: {
    //     type: Sequelize.STRING
    // },
    // createdAt: {
    //     type: Sequelize.DATE,
    //     defaultValue: Sequelize.NOW
    // },
    // updatedAt: {
    //     type: Sequelize.DATE,
    //     defaultValue: Sequelize.NOW
    // }
});
module.exports = Phones;
var Sequelize = require('sequelize');
var db = require('../databse');
var X_Member_Event = db.sequelize.define('x_member_Event', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    price: {
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
    tableName: 'x_member_event'});
module.exports = X_Member_Event;

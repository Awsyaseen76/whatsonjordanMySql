var Sequelize = require('sequelize');
var db = require('../databse');
var UserType = db.define('user_type', {
    userType : {
        type: Sequelize.STRING,
        allowNull : false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
    }
});
module.exports = UserType;

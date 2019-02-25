var Sequelize = require('sequelize');
var db = require('../databse');
var UserType = db.define('user_type', {
    userType : {
        type: Sequelize.STRING,
        allowNull : false
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
module.exports = UserType;

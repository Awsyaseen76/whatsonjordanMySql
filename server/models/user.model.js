// module.exports = function(sequelize, Sequelize){
	var Sequelize = require('sequelize');
	var db = require('../databse');
	var User = db.define('users', {
	  // user_id: {
   //      type: Sequelize.INTEGER,
   //      primaryKey: true,
   //      autoIncrement: true
   //    },
		firstName: {
			type: Sequelize.STRING,
			allowNull: false
	  	},
	  	middleName:{
	  		type: Sequelize.STRING
	  	},
	  	lastName: {
			type: Sequelize.STRING,
			allowNull: false
		},
	  	DOB:{
			type: Sequelize.DATE,
			allowNull: false
		},
	  	email: {
	  		type: Sequelize.STRING,
	  		allowNull: false
	  	},
	  	password: {
	  		type: Sequelize.STRING,
	  		allowNull: false
	  	},
		createdAt:{
			type: Sequelize.DATE,
			defaultValue: Sequelize.literal('NOW()')
		},
		updatedAt:{
			type: Sequelize.DATE,
			defaultValue: Sequelize.literal('NOW()')
		}
	});	
	module.exports = User;
// };
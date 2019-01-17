// var mongoose = require('mongoose');
var Sequelize = require('sequelize');

var username = process.env.MYSQL_USERNAME;
var password = process.env.MYSQL_PASSWORD;

var db = new Sequelize('whatsonjordan', username, password, {
	host: 'localhost',
	dialect: 'mysql',
	operatorsAliases: false,
	pool:{
		max:10,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

db
	.authenticate()
	.then(function(){
		console.log('Connected successfully');

	})
	.catch(function(err){
		console.error('Unable to connect to DB', err);
	});

// sequelize
// 	.sync()
// 	.then(function(){
// 		console.log('whatsonjordan db and user table created successfully');
// 	});

// var db = {};
 
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.user = require('./models/user.model.js')(sequelize, Sequelize);
// console.log(db); 
 
module.exports = db;

var User = require('./models/user.model');
var Role = require('./models/userType.model');
var Contact = require('./models/contact.model');
var Addrress = require('./models/address.model');
var Nationality = require('./models/nationality.model');
var Events = require('./models/event.model');
var Category = require('./models/category.model');
var AgeGroup = require('./models/ageGroup.model');
var Grade = require('./models/grade.model');
var School = require('./models/school.model');


User.belongsTo(Role);
User.belongsTo(Contact);
User.belongsTo(Addrress);
User.belongsTo(Nationality);
User.belongsTo(School);
User.belongsTo(Grade);
User.belongsTo(Events);
Events.belongsTo(Category);
Events.belongsTo(AgeGroup);

db.sync();
// db.sync().then(function(){
// 	// Eager loading iclude all associated models
// 	User
// 		.findById(1, { include: [{ all: true }] })
// 		.then(function (user) {
// 			console.log('Eager loading..............................', user.dataValues.user_type.dataValues);
// 		});
// });


// console.log('Eager loading..............................');
// // Eager loading iclude all associated models

// User
// 	.findById(5,{include: [{all:true}]})
// 	.then(function(user){
// 		console.log(user.dataValues);
// 	});

// User
// 	.findById(5)
// 	.then(function(foundUser){
// 		// console.log(foundUser.dataValues);
// 		foundUser.setUser_type(3);
// 		foundUser.save();
// 	})

// User.findById(1).then(function(user) {
// 	user.setUser_type(1)
// 	user.save();
// 	console.log(user);
// });

// Role.findById(1).then(function(roles){
// 	console.log(roles);
// });

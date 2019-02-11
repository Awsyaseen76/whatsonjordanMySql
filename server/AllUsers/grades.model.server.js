var db = require('../databse');
var gradesDB = require('../models/grade.model');
// var usersDB = require('./users.model.server');
db.sync();

module.exports = gradesDB;

gradesDB.addNewGrade = addNewGrade;
gradesDB.findGradeByGradeId = findGradeByGradeId;
gradesDB.getAllGrades = getAllGrades;

function addNewGrade(id){
    return gradesDB
                .create()
                .then(function(newGrade){
                    // addedMember.setUser(id);
                    return newGrade.save();
                })
}

function findGradeByGradeId(gradeId){
    return gradesDB
        .findOne({gradeId: gradeId})
        .then(function(foundGrade){
            // console.log('foundMember is: ', foundMember);
            return foundGrade.dataValues;
        })
}

function getAllGrades(){
    return gradesDB
                .findAll()
                .then(function(foundGrades){
                    return foundGrades;
                })
}
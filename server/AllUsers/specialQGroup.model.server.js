var db = require('../databse');
var SpecialQGroup = db.SpecialQGroup;
var SpecialQuestion = db.SpecialQuestion;
db.sequelize.sync();

module.exports = SpecialQGroup;

SpecialQGroup.addGroup = addGroup;

function addGroup(groups, organizerId) {
    return Promise.all(groups.map(function(group){
        group.organizerId = organizerId;
        return SpecialQGroup.create(group)
            .then(function(createdGroup){
                Promise.all(group.questions.map(function(question){
                    // question.specialQGroupId = createdGroup.id;
                    if(!question.required){
                        question.required=false;    
                    }
                    SpecialQuestion
                        .create(question)
                        .then(function(createdQuestion){
                            createdGroup.addSpecialQuestion(createdQuestion);
                        });
                }));
                return createdGroup;
            });
    }));
    
    // return SpecialQGroup.create(group)
    //     .then(function (createdGroup) {
    //         console.log('the created group:', createdGroup);
    //         return createdGroup.id;
    //     });
}
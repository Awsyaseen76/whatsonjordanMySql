var db = require('../database');
var SpecialQGroup = db.SpecialQGroup;
var SpecialQuestion = db.SpecialQuestion;
db.sequelize.sync();

module.exports = SpecialQGroup;

SpecialQGroup.addGroup = addGroup;
SpecialQGroup.getOrganizerSQGroups = getOrganizerSQGroups;

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
                return createdGroup.get({plain: true});
            });
    }));
}


function getOrganizerSQGroups(organizerId) {
    return SpecialQGroup
                .findAll({ 
                    where: { organizerId: organizerId},
                    include: [{ all: true }, {model: SpecialQuestion}]
                })
                .then(function(SQGroups){
                    var allSQGroups = {questionsGroups: SQGroups};
                    return allSQGroups;
                });
}
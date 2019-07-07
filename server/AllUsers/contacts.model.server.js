var db = require('../database');
var contactsDB = db.Contact; 
var eventsDB = db.Event;
var SQAnswersDB = db.SQAnswers;
var X_Member_Event = db.X_Member_Event;
var Phone = db.Phone;
var phonesDB = require('../AllUsers/phones.model.server');
var addressesDB = require('../AllUsers/addresses.model.server');
var medicalIssuesDB = require('../AllUsers/medicalIssues.model.server');

db.sequelize.sync();

module.exports = contactsDB;

contactsDB.addNewContact = addNewContact;
contactsDB.findContactsByAuthId = findContactsByAuthId;
contactsDB.updateContact = updateContact;
contactsDB.addEventToMember = addEventToMember;



function addNewContact(authId, roleId, roleName) {
    console.log('the authId: ', authId);
    
    if(roleName && roleName=='Organizer'){
        return contactsDB
            .create({ type: 'Organization', authId: authId, roleId: roleId} );
            // .then(function(addedContact){
            //     return addedContact.createPhone({contactId: addedContact.id});
            // });
    }else{
        return contactsDB
                .create({authId: authId, roleId: roleId});
                // .then(function(addedContact){
                //     return addedContact.createPhone({contactId: addedContact.id});
                // })
    }
    
}

function findContactsByAuthId(authId){
    // console.log(Phone.rawAttributes.type.values);
    // will log the value of the enum
    return contactsDB.findAll({
        where: {authId: authId},
        include: [{all: true}]
    })
}

function updateContact(contact, phone, removedMedical){
    console.log('the contact: ', contact);
    console.log('the medical issues objects: ', contact.medicalIssues);
    
    // return contactsDB.update(contact, {where:{id: contact.id}});
    return contactsDB
                .findById(contact.id)
                .then(function(foundContact){
                    return foundContact.
                                update(contact)
                                    .then(function(updatedContact){
                                        return phonesDB
                                            .updatePhones(phone, contact.id)
                                            .then(function(updatedPhones){
                                                return addressesDB
                                                    .updateOrCreateAddress(contact.addresses, contact.id, contact.type)
                                                    .then(function(address){
                                                        return medicalIssuesDB
                                                            .updateOrCreateMedicalIssues(contact.medicalIssues, contact.id, removedMedical)
                                                                .then(function(medical){
                                                                    console.log('the updated created medical: ', medical);
                                                                    return updatedContact;
                                                                });
                                                    });
                                            });
                                    });
                });
}


function addEventToMember(eventID, memberId, SQAnswer){
    return contactsDB
        .findById(memberId)
        .then(function (contact) {
            return eventsDB
                .findById(eventID)
                .then(function(event){
                    return contact
                        .addEvent(event)
                        .then(function(result1){
                            console.log('the contact.addEvent is: ', result1);
                            return event
                                .addContact(contact)
                                .then(function(result2){
                                    console.log('the event.addContact is: ', result2);
                                    return X_Member_Event
                                        .findOne({where: {contactId: memberId, eventID: eventID}})
                                        .then(function(memEv){
                                            console.log('the member event record', memEv);
                                            // loop the answer create them then add the memEvId for each
                                            return Promise.all(Object.keys(SQAnswer).map(function (key) {
                                                return SQAnswersDB
                                                    .create({ questionID: key, answer: SQAnswer[key]})
                                                        .then(function(answer){
                                                            return memEv.addSQAnswer(answer);
                                                        });
                                            })).then(function (result) {
                                                console.log('the result of memEv.createSQAnswer', result);
                                                return result;
                                            });
                                        });
                                });
                        });
                });
            // return member.addEvent(eventID)
            //         .then(function(result){
            //             console.log('the result after add event to contact', result);
            //         });
        });
}
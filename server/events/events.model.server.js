// var mongoose = require('mongoose');
// var eventsSchema = require('./events.schema.server.js');
var db = require('../databse');
// var Op = db.Sequelize.Op;

var eventsDB = db.Event; // require('../models/event.model');
var SQGroups = db.SpecialQGroup;
var SQuestions = db.SpecialQuestion;
var addressesDB = require('../AllUsers/addresses.model.server');
var geoLocationsDB = require('../AllUsers/geoLocation.model.server');
// var GeoLocation = require('../models/geoLocation.model');
var Address = db.Address; // require('../models/address.model');
// var expensesDB = require('../AllUsers/expenses.model.server');
var programDetailsDB = require('../AllUsers/progamDetails.model.server');
db.sequelize.sync();



// var eventsDB = mongoose.model('eventsDB', eventsSchema);

module.exports = eventsDB;

eventsDB.addNewEvent = addNewEvent;
eventsDB.reNewEvent = reNewEvent;
eventsDB.getAllEvents = getAllEvents;
eventsDB.findEventByEventId = findEventByEventId;
eventsDB.findEventsByOrganizerId = findEventsByOrganizerId;
eventsDB.updateEvent = updateEvent;
eventsDB.updateEventByAdmin = updateEventByAdmin;
// eventsDB.addMemberToEvent = addMemberToEvent;
// eventsDB.addToDiscountedMembers = addToDiscountedMembers;
// eventsDB.addExpense = addExpense;
// eventsDB.addToFrozeMembers = addToFrozeMembers;
// eventsDB.removeFrozen = removeFrozen;
// eventsDB.createMakerEventsList = createMakerEventsList;




/* 
on event creation: 
event details:  { name: 'Event 1',
  category: 'Category 1',
  subcategory: 'sub category 1',
  ageGroup: { ageGroupTitle: 'Junior', ageGroupFrom: 4, ageGroupTo: 6 },
  details: 'Details',
  startingDate: '2019-02-28T22:00:00.000Z',
  expiryDate: '2019-03-31T21:00:00.000Z',
  sessionStartTime: '1970-01-01T14:00:00.000Z',
  sessionEndTime: '1970-01-01T16:00:00.000Z',
  price: '200',
  address: 'Amman',
  termsAndConditions: 'Terms and conditions 1',
  daysPerWeek: [ 6, 1, 3 ],
  eventDays:
   [ 'Sat Mar 02 2019',
     'Mon Mar 04 2019',
     'Wed Mar 06 2019',
     'Sat Mar 09 2019',
     'Mon Mar 11 2019',
     'Wed Mar 13 2019',
     'Sat Mar 16 2019',
     'Mon Mar 18 2019',
     'Wed Mar 20 2019',
     'Sat Mar 23 2019',
     'Mon Mar 25 2019',
     'Wed Mar 27 2019',
     'Sat Mar 30 2019' ],
  coordinates: [ 35.8770069, 32.003292099999996 ],
  programDailyDetails: { 'Sat Mar 02 2019': { title: 'Day 1', details: 'Day one details', videoLink: '' } } }
*/

function addNewEvent(organizerId, event, SQGroups) {
	console.log('organizerId: ', organizerId);
	// event.main.categoryId = event.category.categoryId;
	// event.main.subCategoryId = event.category.subCategoryId;
	// event.main.ageGroupId = event.age.ageGroup.id;
	// // event.main.addressId = event.address.id;
	// event.main.organizerId = organizerId;
	
	console.log('the final event object: ', event);
	
	return eventsDB
		.create(event.main)
		.then(function (addedEvent) {
			// send the address to addressesDB to create address there and then set the id on the event
			// if the maker add new address then create address and geolocation on the database
			if(event.newAddressAdded){
				return geoLocationsDB
						.addEventLocation(event.geoLocation)
						.then(function(addedLocation){
							event.address.geoLocationId = addedLocation.id;
							event.address.contactId = organizerId;
							return addressesDB
									.createAddress(event.address)
									.then(function(addedAddress){
										return programDetailsDB
											.addProgramDetails(addedEvent.id, event.programDetails)
											.then(function(addedProgramDetails){
												addedEvent.addressId = addedAddress.id;
												return addedEvent
													.save()
													.then(function(theAddedEvent){
														if (SQGroups) {
															return Promise.all(SQGroups.map(function (group) {
																return theAddedEvent.addSpecialQGroup(group);
															}));
														}else{
															return addedEvent.save();
														}
													});
											});
									});				
						});
			}else{
				return programDetailsDB
					.addProgramDetails(addedEvent.id, event.programDetails)
					.then(function (addedProgramDetails) {
						if (SQGroups) {
							return Promise.all(SQGroups.map(function (group) {
								return addedEvent.addSpecialQGroup(group);
							}));
						}else{
							return addedEvent.save();
						}
					});
			}
		});
}

function reNewEvent(reNewedEvent){
	// reNewedEvent.daysPerWeek = JSON.stringify(reNewedEvent.daysPerWeek);
	// reNewedEvent.dailyDetails = JSON.stringify(reNewedEvent.dailyDetails);
	// reNewedEvent.images = JSON.stringify(reNewedEvent.images);

	// reNewedEvent.categoryId = reNewedEvent.category.id;
	// reNewedEvent.subCategoryId = reNewedEvent.subCategory.id;
	// reNewedEvent.ageGroupId = reNewedEvent.ageGroup.id;
	// reNewedEvent.addressId = reNewedEvent.address.id;
	console.log('the renewed event: ', reNewedEvent);
	
	return eventsDB
		.create(reNewedEvent)
		.then(function(addedEvent){
			// if the maker add new address the address he must change the geolocation also
			if (reNewedEvent.newAddressAdded){
				return geoLocationsDB
					.addEventLocation(reNewedEvent.geoLocation)
						.then(function (addedLocation) {
							reNewedEvent.address.geoLocationId = addedLocation.id;
							reNewedEvent.address.contactId = reNewedEvent.contactId;
							return addressesDB
								.createAddress(reNewedEvent.address)
								.then(function(addedAddress){
									addedEvent.addressId = addedAddress.id;
									return addedEvent.save();
								});
						});
			}else{
				return addedEvent;
			}
		})
		.then(function (result){
			console.log('the result of above: ', result.get({plain: true}));
			reEv = result.get({ plain: true });
			return programDetailsDB
				.addProgramDetails(reEv.id, reNewedEvent.programDetails)
				.then(function (addedProgramDetails) {
					return reEv;
				});
		});
}

function getAllEvents() {
	var today = (new Date()).toISOString();
	return eventsDB
		.findAll({
			where: {startingDate: {$gte: today}},
			// include: [{ all: true }]
			include: [{ all: true }, { model: Address, include: [{ all: true }] }]
		});
		// .sort('startingDate')
		// .populate('organizerId')
		// .exec();
}




// function removeFrozen(ids){
// 	// console.log(ids);
// 	var eventId = ids.eventId;
// 	var userId = ids.userId;
// 	var originalEventId = ids.originalEventId;
// 	return eventsDB
// 				.findById(eventId)
// 				.then(function(event){
// 					console.log('the found event is:');
// 					console.log(event);
// 					for(var f in event.frozeMembers){
// 						if(event.frozeMembers[f].userId === userId){
// 							// instead of remove the frozen members set the compensated to true
// 							// event.frozeMembers.splice(f,1);
// 							event.frozeMembers[f].compensated = true;
// 							console.log('compensated after is: ',event.frozeMembers[f].compensated);
// 						}
// 					}
// 					return event.save();
// 					// return usersDB.findById(userId);
// 				})
// 				// .then(function(user){
// 				.then(
// 					usersDB
// 						.findById(userId)
// 						.then(function(user){
// 							console.log('the user is: ');
// 							console.log(user);
// 							for(var i in user.userEventParameters){
// 								if(user.userEventParameters[i].eventId === originalEventId){
// 									user.userEventParameters[i].freezeDays.splice(0, user.userEventParameters[i].freezeDays.length);
// 								}
// 							}
// 							return user.save();
							
// 						})

// 					);
// }




// function addToFrozeMembers(freezeObject){
// 	var eventId = freezeObject.eventId;
// 	return eventsDB
// 			.findById(eventId)
// 			.then(function(event){
// 				event.frozeMembers.push(freezeObject);
// 				return event.save();
// 			});
// }


function addExpense(eventId, expense){
	return eventsDB
				.findById(eventId)
				.then(function(event){
					expensesDB
						.createExpense(expense)
						.then(function(addedExpense){
							console.log('the added expense: ', addedExpense);
							event.expense
						})
					
					// event.expenses.push(expense);
					// return event.save();
				});
}


// function addToDiscountedMembers(ids){
// 	var eventId = ids.eventId;
// 	var userId = ids.userId;
// 	return eventsDB
// 				.findById(eventId)
// 				.then(function(event){
// 					for(var u in event.discountedMembers){
// 						if(event.discountedMembers[u] === userId){
// 							var err = 'You Already had a discount!';
// 							return (err);
// 						}else{
// 							event.discountedMembers.push(userId);
// 							return event.save();
// 						}
// 					}
// 				});
// }


// function addMemberToEvent(eventId, userId){
// 	return eventsDB
// 			.findById(eventId)
// 			.then(function(event){
// 				event.registeredMembers.push(userId);
// 				return event.save();
// 			});
// }


function findEventByEventId(eventId){
	return eventsDB
				.find({
					where: {id: eventId},
					attributes: {exclude: ['createdAt', 'updatedAt', 'appropved', 'special']},
					include: [
							{all:true}, 
							{model: Address, include: [{all:true}]},
							{model: SQGroups, include: [{ model: SQuestions}]}
						]
				}, {raw: true})
				.then(function(event){
					var foundEvent = event.get({plain: true});
					return programDetailsDB
						.findDetailsByEventId(foundEvent.id)
						.then(function (detailsList) {
							foundEvent.programDetails = detailsList;
							console.log('the event inside: ', foundEvent);
							return foundEvent;
						});
				});
}

function findEventsByOrganizerId(organizerId){
	var organizerEvents = eventsDB.findAll({where: {contactId: organizerId}, include: [{all:true}]});
	var eventsProgDetails = programDetailsDB.findDetailsByEventId()
	
	return eventsDB
				.findAll({
					where: {contactId: organizerId},
					include: [
						{all: true}, 
						{model: Address, include: [{all: true}]}],
					// raw: true
				})
				.then(function(eventsList){
					return Promise.all(eventsList.map(function(e){
						var event = e.get({plain: true});
						return programDetailsDB	
								.findDetailsByEventId(event.id)
								.then(function(detailsList){
									event.programDetails = detailsList;
									console.log('the event inside: ', event);
									return event;
									});
								})
					).then(function(result){
						// console.log('the events: ', eventsLists);
						console.log('the result from the promise all: ', result);
						return result;
					});
					
				});
	// return eventsDB
	// 			.find({organizerId: organizerId})
	// 			.sort('startingDate')
	// 			.populate('registeredMembers')
	// 			.exec();
}


// function createMakerEventsList(organizerId){
// 	var today = (new Date()).toISOString();
// 	return eventsDB
// 				.find({
// 					organizerId: organizerId,
// 					startingDate: {$gt: today}
// 				})
// 				.sort('startingDate')
// 				.exec();
// }


function updateEventByAdmin(eventId, updatedEvent){
	return eventsDB.update(updatedEvent, {where: {id: eventId}});
}


function updateEvent(eventId, updatedEvent){
	// console.log('the updated event: ', updatedEvent);	
	return eventsDB
		.findById(eventId)
		.then(function (foundEvent) {
			return programDetailsDB
				.updateProgramDetails(eventId, updatedEvent.programDetails)
				.then(function(){
					// if the maker add new address the address he must change the geolocation also
					if(updatedEvent.newAddressAdded){
						return geoLocationsDB
						.addEventLocation(updatedEvent.geoLocation)
						.then(function(addedLocation){
							updatedEvent.address.geoLocationId = addedLocation.id;
								updatedEvent.address.contactId = updatedEvent.organizerId;
								return foundEvent;
							})
							.then(function(foundEvent){
								return addressesDB
										.createAddress(updatedEvent.address)
										.then(function(addedAddress){
											updatedEvent.addressId = addedAddress.id;
											return foundEvent;
										});
							})
							.then(function(foundEvent){
								return foundEvent.update(updatedEvent);
							});
						}else{
							return foundEvent.update(updatedEvent);
						}
					});
		});
}




// function removeEvent(organizerId, eventId){
// 	return eventsDB
// 				.remove({_id: eventId})
// 				.then(function(status){
// 					return usersDB.removeEventFromList(organizerId, eventId);
// 				})
// 				.then(function(removedEvent){
// 					return removedEvent;
// 				});
// }
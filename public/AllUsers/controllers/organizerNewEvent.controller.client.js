(function(){
	angular
		.module('whatsOnJordan')
		.controller('organizerNewEventController', organizerNewEventController);

	function organizerNewEventController($location, eventsService, getterService, loggedOrganizer, authService){
			var model = this;
			function init(){
				if(!loggedOrganizer){
					$location.url('/login');
				}
				
				model.organizerProfile = loggedOrganizer.chosenRole;
				model.allRoles = loggedOrganizer.allRoles;
				
				
				console.log('logged Organizer: ', loggedOrganizer);

				model.newEventMain = true;
				model.newAddressAdded = false;
				model.addressSelected = false;
				// model.newGeoLocationAdded = false;
				var organizerId = model.organizerProfile.contact.id;
				
				getterService
					.getEventHelpers(organizerId)
					.then(function (result) {
						var eventHelpers = result.data;
						console.log('the event helpers:', eventHelpers);
						for(var i in eventHelpers){
							console.log('the helper: ', eventHelpers[i]);
							console.log('each event: ', Object.keys(eventHelpers[i])[0] );
							var key = Object.keys(eventHelpers[i])[0];
							model[key] = eventHelpers[i][Object.keys(eventHelpers[i])[0]];
						}
					})
					.then(function(){
						eventsService
								.getMapBoxKey()
								.then(function(mapBoxKey){
									model.mapBoxKey = mapBoxKey.data;

									// MapBox Maps
									// Get the access token from the server
									mapboxgl.accessToken = model.mapBoxKey;
									$('#mapModal').on('shown.bs.modal', function() {
										// Initilise the map 
										var map = new mapboxgl.Map({
											container: 'mapForLocation',
											// style: 'mapbox://styles/mapbox/streets-v10',
											style: 'mapbox://styles/mapbox/satellite-streets-v9',
											center: [35.87741988743201, 32.003009804995955],
											// center: [model.position.currentposition.lng, model.position.currentposition.lat],
											zoom: 12
										});

										// Show map controller
										map.addControl(new mapboxgl.NavigationControl());

										// Get the location from the map
										map.on('click', function(e) {
											// var latitude = e.lngLat.lat;
											// var longitude = e.lngLat.lng;
											model.mapLocation.latitude = e.lngLat.lat;
											model.mapLocation.longitude = e.lngLat.lng;
											document.getElementById('mapLat').innerHTML = model.mapLocation.latitude;
											document.getElementById('mapLng').innerHTML = model.mapLocation.longitude;
										});

									});	
								});
							});

			}
			init();
			
			model.createEvent = createEvent;
			model.logout = logout;
			model.cancelCreate = cancelCreate;
			model.createEventDetails = createEventDetails;
			model.createSpecialQuestions = createSpecialQuestions;
			model.getCurrentLocation = getCurrentLocation;
			model.getLocationFromMap = getLocationFromMap;
			model.mapLocation = {longitude: 0, latitude: 0};
			model.addNewAddress = addNewAddress;
			model.selectAddress = selectAddress;
			model.eventDays = []; // will hold the event days with details
			model.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // to create the daysOfWeek
			model.daysOfWeek = {}; // will hold the days per week plus each day session time
			model.addNewQuestionGroup = addNewQuestionGroup;
			model.specialQGroups = [];
			model.selectOptionsList = [0];
			model.selecetedGroups = {};

			function createSpecialQuestions(newEvent){
				model.newEventProgramDetails = false;
				model.newEventSpecialQuestions = true;
				console.log('the received event: ', newEvent);
			}

			function addNewQuestionGroup(questionsGroup){
				console.log('the question is', questionsGroup);
				model.specialQGroups.push(questionsGroup);
				console.log('the questions groups list are: ', model.specialQGroups);
				model.selectOptionsList = [0];
			}


			function selectAddress(){
				model.addressSelected = true;
				model.newAddressAdded = false;
			}

			function getCurrentLocation() {
			    if (navigator.geolocation) {
			        navigator.geolocation.getCurrentPosition(showPosition);
			    } else { 
			        console.log("Geolocation is not supported by this browser.");
			    }
			}

			function showPosition(position){
				model.mapLocation.latitude = position.coords.latitude; 
				model.mapLocation.longitude = position.coords.longitude;
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;
			}

			function getLocationFromMap(){
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;
			}


			function createEventDetails(newEvent, mapLocation){
				// create dates based on start-end dates and the days of the weeks
				var start = new Date(newEvent.main.startingDate);
				var end = new Date(newEvent.main.expiryDate);
				
				// to create event days for the whole event based on days per week
				for (start; end>start; start.setDate(start.getDate()+1)){
					inner:
					for(var j in model.daysOfWeek){
						if (start.getDay() === Number(j) && model.daysOfWeek[j].day==true){
							model.eventDays.push({date: start.toDateString(), time: {from: model.daysOfWeek[j].from, to: model.daysOfWeek[j].to}});
							break inner;
						}
					}
				}
				
				// remove unselected days
				for (var i in model.daysOfWeek) {
					if (model.daysOfWeek[i].day == false) {
						delete (model.daysOfWeek[i]);
					}
				}
				
				newEvent.main.daysPerWeek = model.daysOfWeek;
				newEvent.geoLocation = mapLocation;
				model.newEvent = newEvent;
				model.newEventMain = false;
				model.newEventProgramDetails = true;
			}

			
			function createEvent(newEvent){
				newEvent.organizerId = model.organizerProfile.contact.id;
				newEvent.newAddressAdded = model.newAddressAdded;
				newEvent.addressSelected = model.addressSelected;
				newEvent.programDetails = [];
				newEvent.specialQuestionsGroups = model.specialQGroups;
				for(var i in model.eventDays){
					newEvent.programDetails.push({
						date: model.eventDays[i].date,
						sessionStartTime: model.eventDays[i].time.from,
						sessionEndTime: model.eventDays[i].time.to,
						title: model.eventDays[i].dailyDetails ? model.eventDays[i].dailyDetails.title : null,
						details: model.eventDays[i].dailyDetails ? model.eventDays[i].dailyDetails.details : null,
						videoLink: model.eventDays[i].dailyDetails ? model.eventDays[i].dailyDetails.videoLink : null,
					});
				}
				newEvent.selectedSQGroups = [];
				console.log('here', model.selecetedGroups);
				if(Object.keys(model.selecetedGroups).length>0){
					for(var g in model.selecetedGroups){
						if(model.selecetedGroups[g]){
							for(var c in model.questionsGroups){
								console.log('are they equal?: ', model.questionsGroups[c].id == g);
								if(model.questionsGroups[c].id == g){
									newEvent.selectedSQGroups.push(model.questionsGroups[c]);
								}
							}
						}
					}
				}

				console.log('the event to create', newEvent);
				eventsService
					.addNewEvent(newEvent)
					.then(function(addedEvent){
						$location.url('/organizerProfile/eventsList');
						console.log('the created event is: ', addedEvent);
					});
			}

			function logout(){
				authService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}

		function cancelCreate() {
			var url = "/OrganizerProfile";
			$location.url(url);
		}

		function addNewAddress() {
			console.log('new address added');
			model.newAddressAdded = true;
			model.addressSelected = false;
		}
			
			

		}
})();




(function(){
	angular
		.module('whatsOnJordan')
		.controller('eventDetailsController', eventDetailsController);

		function eventDetailsController($routeParams, eventsService, authService, $location){
			var model = this;

			function init(){
				model.error2 = null;
				var eventId = $routeParams.eventId;
				// var eventDetails = eventsService.findEventByEventId(eventId);
				eventsService.findEventByEventId(eventId)
					.then(function(eventDetails){
						model.eventDetails = eventDetails;
					});
				// check if there any user has already logged in to use it instead of the $rootScope
				authService
					.checkAuthLogin()
					.then(function(user){
						if(user){
							model.loggedMember = user;
							if (user.chosenRole == 'Member') {
								for (var i in user.roles) {
									if (user.roles[i].name == user.chosenRole) {
										user.roles[i].email = user.email;
										model.loggedMemberDetails = user.roles[i];
										// Calculate the logged user age and add the age to the user's object
										model.loggedMemberDetails.contact.DOB = new Date(model.loggedMemberDetails.contact.DOB);
										var birthDay = model.loggedMemberDetails.contact.DOB;
										var today = new Date();
										model.loggedMemberDetails.age = Math.abs((new Date(today - birthDay.getTime())).getUTCFullYear() - 1970);
										console.log('the user is: ', model.loggedMemberDetails);
									}
								}
							}
							// model.loggedMember.member.DOB = new Date(model.loggedMember.member.DOB);
						}
					});
				
				model.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // to create the daysOfWeek
				
				
				// Custom form 
				model.test = {}; // test if ng-model bind data to from html element?
				// this array will be in the custom requiremet table
				model.testCustomForm = [
					{tag: 'input-text', options: {type: 'text', value: 'this is input test', 'ng-model': 'model.test.text'}, label: 'input test', key: 'pastExperience'},
					// {tag: 'h1', options: {text: 'this is h1'}, label: 'h1 test'},
					{tag: 'select', options: [{ value: 'a', text: 'Aws' }, { value: 'b', text: '' }, { value: 'm', text: 'Mohammed' }], label: 'select test', key: 'selectedOption'},
					{tag: 'input-checkbox', options: { type: 'checkbox', checked: false}, label: 'checkbox test', key: 'healthIssue'} 
				];
				
				// var divToFill = angular.element(document.querySelector('#customeElements'));
				// $.each(model.testCustomForm, function(index, value){
				// 	divToFill.append('<br><label>' + value.label + ':&nbsp '+ '</label>');
				// 	if(value.tag === 'select'){
				// 		var selEl = $('<' + value.tag +' id="selectElement"'+ '>' + '</' + value.tag + '>'); //{
				// 		$(value.options).each(function(ind, val){
				// 			selEl.append($('<option></option>').attr('value', val.value).text(val.text || val.value));
				// 		});
				// 		selEl.attr("ng-model", model.test.select).appendTo(divToFill);
				// 	}else{
				// 		$('<' + value.tag + '>' + '</' + value.tag + '>', //{
				// 		value.options
				// 		).appendTo(divToFill);

				// 	}
				// });
				
			}
			init();

			model.eventRegistration = eventRegistration;
			model.logout = logout;

			function logout(){
				authService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}



			function eventRegistration(event, user){
				var eventId = event.id;
				var memberId = user.member.id;
				console.log('event name: ', event.name , ' user name:', user.member.firstName);
				if (!model.loggedMember){
					model.error1 = 'Please login or sign-up to register on this event';
					$('#eventRegistrationModal').modal('hide');
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					return;
				} else {
					var userId = model.loggedMember.id;
					var eventsList = model.loggedMember.registeredEventsList;
					for(var e in eventsList){
						if(eventsList[e].id === event.id){
							model.error2 = 'You already registered for this event';
							return;
						}
					}
					
					authService
						.addEventToUser(eventId, memberId)
						.then(function (response){
							$location.url('/memberProfile');
					});
					if(user.termsAcceptance){
						$('#eventRegistrationModal').modal('hide');
					}else{
						$("#registrationForm").validate({
						    rules: {
						      termsAcceptance: {
						      	required: true
						      }
						    },
						    messages: {
						      termsAcceptance: {
						      	required: "<b style='color: red;'>Please accept the terms and conditions</b>"
						      }
						    }
						  });
						alert('Please read and accept the terms and conditions');
						// model.termsError = 'You should read and accept the terms and conditions to register for this event';
						// $('#registrationForm').css('background-color', 'red');
					}
				}

			}

		}

})();
(function(){
	angular
		.module('whatsOnJordan')
		.controller('eventDetailsController', eventDetailsController);

		function eventDetailsController($routeParams, eventsService, authService, $location){
			var model = this;

			function init(){
				model.error2 = null;
				model.SQAnswer = {};
				var eventId = $routeParams.eventId;
				// var eventDetails = eventsService.findEventByEventId(eventId);
				eventsService.findEventByEventId(eventId)
					.then(function(eventDetails){
						model.eventDetails = eventDetails;
						console.log('the event details are: ', model.eventDetails);
						
					});
				// check if there any user has already logged in to use it instead of the $rootScope
				authService
					.checkAuthLogin()
					.then(function(user){
						if(user){
							model.loggedMember = user;
							if (user.chosenRole === 'Member') {
								for (var i in user.roles) {
									if (user.roles[i].name == user.chosenRole) {
										user.roles[i].email = user.email;
										model.loggedMemberDetails = user.roles[i];
										// check if the member already registered for this event
										var eventsList = model.loggedMemberDetails.contact.events;
										for (var e in eventsList) {
											if (eventsList[e].id == eventId) {
												model.error2 = 'You already registered for this event';
												console.log(model.error2);
												$('#eventRegistrationModal').modal('hide');
												$('html, body').animate({ scrollTop: 0 }, 'slow');
												return;
											}
										}
										// Calculate the logged user age and add the age to the user's object
										console.log('the dob: ', model.loggedMemberDetails.contact.DOB);
										
										model.loggedMemberDetails.contact.DOB = new Date(model.loggedMemberDetails.contact.DOB);
										var birthDay = model.loggedMemberDetails.contact.DOB;
										var today = new Date();
										model.loggedMemberDetails.age = Math.abs((new Date(today - birthDay.getTime())).getUTCFullYear() - 1970);
										console.log('the user is: ', model.loggedMemberDetails);
									}
								}
							}
							// model.loggedMember.member.DOB = new Date(model.loggedMember.member.DOB);
						}else{
							model.error1 = 'Please login or sign-up to register on this event';
							$('#eventRegistrationModal').modal('hide');
							$('html, body').animate({ scrollTop: 0 }, 'slow');
							return;
						}
					});
				
				model.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // to create the daysOfWeek
				
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



			function eventRegistration(event, user, SQAnswer){
				if (!model.loggedMember){
					model.error1 = 'Please login or sign-up to register on this event';
					$('#eventRegistrationModal').modal('hide');
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					return;
				} else{
					var eventId = event.id;
					var memberId = user.contact.id;
					console.log('event name: ', event.name, 'user name:', user.contact.name);

					// authService
					// 	.addEventToMember(eventId, memberId, SQAnswer)
					// 	.then(function (response){
					// 		$location.url('/memberProfile');
					// });
					if(user.termsAcceptance){
						$('#eventRegistrationModal').modal('hide');
						console.log('the user: ', user);
						console.log('the event: ', event);
						console.log('the SQAnswer: ', SQAnswer);
						authService
							.addEventToMember(eventId, memberId, SQAnswer)
							.then(function (response){
								$location.url('/profile');
								return;
							});
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
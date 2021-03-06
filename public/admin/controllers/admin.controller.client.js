(function() {
	angular
		.module('whatsOnJordan')
		.controller('adminController', adminController);

	function adminController(userService, eventsService, userTypesService, loggedAdmin, $location, $route) {
		var model = this;

		function init() {
			if(!loggedAdmin){
				$location.url('/login');
			}
			userTypesService
				.getAllUserTypes()
				.then(function(userTypes){
					model.userTypes = userTypes.data;
				})
			model.loggedAdmin = loggedAdmin;
			model.adminPage = loggedAdmin;
			model.users = null;
			model.events = null;
		}
		init();

		model.logout = logout;
		model.getAllUsers = getAllUsers;
		model.getAllEvents = getAllEvents;
		model.updateEventByAdmin = updateEventByAdmin;
		model.getAllFeedbacks = getAllFeedbacks;
		model.updateFeedbackByAdmin = updateFeedbackByAdmin;
		model.setUserRole = setUserRole;

		function updateFeedbackByAdmin(feedback){
			userService
				.updateFeedbackByAdmin(feedback)
				.then(getAllFeedbacks);
		}

		function getAllFeedbacks(){
			model.events = null;
			model.users = null;
			userService
				.getAllFeedbacks()
				.then(function(feedbacks){
					model.feedbacks = feedbacks.data;
				});
		}

		function getAllUsers(){
			model.events = null;
			model.feedbacks = null;
			return userService
				.getAllUsers()
				.then(function (users){
					if(users){
						model.users = users.data;
					}
				});
		}

		function getAllEvents(){
			model.users = null;
			model.feedbacks = null;
			eventsService
					.getAllEvents()
					.then(function(events){
						if(events){
							model.events = events;	
						}
					});
		}

		function updateEventByAdmin(event){
			eventsService
					.updateEventByAdmin(event)
					.then(getAllEvents);
		}



		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}

		function setUserRole(user){
			userService
				.setUserRole(user)
				.then(function(result){
					console.log('user role has been changed');
					$route.reload();
				})
		}

	}
})();
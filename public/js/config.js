(function () {
	angular
		.module('whatsOnJordan')
		.config(configuration);

	function configuration($routeProvider) {
		$routeProvider
			//ok
			.when('/', {
				templateUrl: '../views/pages/home.html',
				controller: 'homePageController',
				controllerAs: 'model'
				// add a controller to use the logged user instead of $rootScope
			})
			//ok
			.when('/allEvents', {
				templateUrl: 'events/templates/allEvents.view.client.html',
				controller: 'allEventsController',
				controllerAs: 'model'
			})

			.when('/allEvents/:makerId', {
				templateUrl: 'events/templates/allEvents.view.client.html',
				controller: 'allEventsController',
				controllerAs: 'model'
			})

			.when('/login', {
				templateUrl: 'AllUsers/templates/login.view.client.html',
				controller: 'loginController',
				controllerAs: 'model'
			})
			
			.when('/register', {
				templateUrl: 'AllUsers/templates/register.view.client.html',
				controller: 'registerController',
				controllerAs: 'model'
			})

			.when('/forgetPassword', {
				templateUrl: 'AllUsers/templates/forgetPassword.view.client.html',
				controller: 'forgetPasswordController',
				controllerAs: 'model'	
			})
			.when('/resetPassword/:token', {
				templateUrl: 'AllUsers/templates/resetPassword.view.client.html',
				controller: 'resetPasswordController',
				controllerAs: 'model'	
			})
			
			.when('/profile', {
				resolve: {
					loggedMember: checkAuthRole
				}
			})

			
			.when('/MemberProfile', {
				templateUrl: 'AllUsers/templates/memberProfile.view.client.html',
				controller: 'memberProfileController',
				controllerAs: 'model',
				resolve: {
					loggedMember: isMember
				}
			})
			
			.when('/updateMemberProfile', {
				templateUrl:'AllUsers/templates/updateMemberProfile.view.client.html',
				controller: 'updateMemberProfile',
				controllerAs: 'model',
				resolve:{
						loggedMember: isMember
				}
			})

			// .when('/makerProfile', {
			// 	templateUrl: 'AllUsers/templates/makerProfile.view.client.html',
			// 	controller: 'makerProfileController',
			// 	controllerAs: 'model',
			// 	resolve: {
			// 		loggedMaker: isOrganizer
			// 	}
			// })

			.when('/OrganizerProfile', {
				templateUrl: 'AllUsers/templates/makerProfile.view.client.html',
				controller: 'makerProfileController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isOrganizer
				}
				// key: 'Organizer'
			})

			.when('/updateMakerProfile', {
				templateUrl:'AllUsers/templates/updateMakerProfile.view.client.html',
				controller: 'makerProfileController',
				controllerAs: 'model',
				resolve:{
					loggedMaker: isOrganizer
				}
			})


			.when('/AdminProfile', {
				templateUrl: 'admin/templates/adminPage.view.client.html',
				controller: 'adminController',
				controllerAs: 'model',
				resolve: {
					loggedAdmin: isAdmin
				}

			})
			
			.when('/eventDetails/:eventId',{
				templateUrl: 'events/templates/eventDetails.view.client.html',
				controller: 'eventDetailsController',
				controllerAs: 'model'
			})


			.when('/makerProfile/eventsList', {
				templateUrl:  'AllUsers/templates/makerEventsList.view.client.html',
				controller:   'makerEventsListController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isOrganizer
				}
			})


			.when('/makerProfile/newEvent', {
				templateUrl: 'AllUsers/templates/makerNewEvent.view.client.html',
				controller: 'makerNewEventController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isOrganizer
				}
			})

			.when('/makerProfile/reNewEvent/:eventId', {
				templateUrl: 'AllUsers/templates/makerReNewEvent.view.client.html',
				controller: 'makerReNewEventController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isOrganizer
				}
			})

			.when('/makerProfile/editEvent', {
				templateUrl: 'AllUsers/templates/makerEditEvent.view.client.html',
				controller: 'makerEditEventController',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isOrganizer
				}
			})

			.when('/makerProfile/makerEventDetails/:eventId', {
				templateUrl: 'events/templates/makerEventDetails.view.client.html',
				controller: 'makerEventDetails',
				controllerAs: 'model',
				resolve: {
					loggedMaker: isOrganizer
				}
			})

			// .when('/admin', {
			// 	templateUrl: 'admin/templates/adminPage.view.client.html',
			// 	controller: 'adminController',
			// 	controllerAs: 'model',
			// 	resolve: {
			// 		loggedMember: checkAuthLogin
			// 	}
			// })
			.when('/contact', {
				templateUrl: '../views/pages/contact.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.when('/about', {
				templateUrl: '../views/pages/about.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.otherwise({redirectTo: '/'});
	}
	
	// check the user if still logged in through the server cockies if the user logged in he is in the cockies based on that we can protect the url
	function isMember(authService, $q, $location){
		var deferred = $q.defer();
		authService
			.checkAuthLogin()
			.then(function(user){
				if(user === null){
					deferred.reject();
					$location.url('/login');
				} else if (user.roles.length == 1 && user.roles[0].name == "Member"){
					user.roles[0].email = user.email;
					console.log('the member details: ', user.roles[0]);
					deferred.resolve({chosenRole: user.roles[0], allRoles: user});
				} else if(user.chosenRole == 'Member'){
					console.log('the user details all: ', user);
					for(var i in user.roles){
						if(user.roles[i].name == user.chosenRole){
							user.roles[i].email = user.email;
							deferred.resolve({ chosenRole: user.roles[i], allRoles: user });
						}
					}
					
					// deferred.resolve(user);
				}
			});
		return deferred.promise;
	}

	function isOrganizer(authService, $q, $location){
		var deferred = $q.defer();
		authService
			// .isOrganizer()
			.checkAuthLogin()
			.then(function(maker){
				if(maker === null){
					deferred.reject();
					$location.url('/login');
				} else if(maker.chosenRole == 'Organizer'){
					for (var i in maker.roles) {
						if (maker.roles[i].name == maker.chosenRole) {
							maker.roles[i].email = maker.email;
							deferred.resolve({chosenRole: maker.roles[i], allRoles: maker});
						}
					}
					// deferred.resolve(maker);
				}else{
					deferred.reject();
					$location.url('/login');
				}
			});
		return deferred.promise;
	}

	function isAdmin(authService, $q, $location){
		var deferred = $q.defer();
		authService
			.isAdmin()
			.then(function(admin){
				if(admin === null){
					deferred.reject();
					$location.url('/');
				}else{
					deferred.resolve(admin);
				}
			});
			return deferred.promise;
	}



	// function getAuthRoles(authService, $q, $location){
	// 	var deferred = $q.defer();
	// 	authService
	// 		.getAuthRoles()
	// 		.then(function(roles){
	// 			if(roles){
	// 				console.log('available roles: ', roles.data);
	// 				deferred.resolve(roles.data);
	// 				// $location.url('/chooseRole');
	// 				// return deferred.promise;
	// 			}
	// 		});
	// 		return deferred.promise;
	// 	}

	function checkAuthRole(authService, $q, $location){
		var deferred = $q.defer();
		authService
			.checkAuthLogin()
			.then(function(result){
				var user = result;
				console.log('the result of check user login', user);
				if(user.roles.length > 1){
					var route1 = '/' + user.chosenRole + 'Profile';
					$location.url(route1);
				}else{
					var route2 = '/' + user.roles[0].name + 'Profile';
					$location.url(route2);
				}

				
				// if(user.roles.length > 1){
				// 	for(var i in user.roles){					
				// 		if(user.roles[i].loggedWithin){
				// 			// console.log('logged within: ', user.roles[i].loggedWithin);
				// 			var route = '/' + user.roles[i].name + 'Profile';
				// 			$location.url(route);
				// 			return;
				// 		}
				// 	}
				// 	// var roles = [];
				// 	// for(var r in user.roles){
				// 	// 	// roles.push({ roleName: user.roles[r].name, active: user.roles[r].x_auths_roles.active});
				// 	// 	roles.push(user.roles[r]);
				// 	// }
				// 	// console.log('the auth has many roles');
				// 	// console.log('the user roles: ', roles);
				// 	// $location.url('/chooseRole');
				// 	// return;
				// }else{
				// 	// $location.url('/userProfile');
				// 	deferred.resolve(user);
				// 	var x = '/'+user.roles[0].name+'Profile';
				// 	$location.url(x);
				// 	return deferred.promise;
				// }



				// if(user.data.roleId === 1){
				// 	deferred.resolve(user.data);
				// 	$location.url('/userProfile');
				// 	return deferred.promise;
				// } else if(user.data.roleId === 2){
				// 	deferred.resolve(user.data);
				// 	$location.url('/makerProfile');
				// 	return deferred.promise;
				// }else if(user.data.roleId === 3){
				// 	deferred.resolve(user.data);
				// 	$location.url('/adminPage');
				// 	return deferred.promise;
				// }else{
				// 	deferred.reject();
				// 	$location.url('/');
				// }
			});
	}

})();
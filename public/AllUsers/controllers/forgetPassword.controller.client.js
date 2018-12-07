(function() {
	angular
		.module('whatsOnJordan')
		.controller('forgetPasswordController', forgetPasswordController);

	function forgetPasswordController(userService, $location) {

		var model = this;
		model.logout = logout;

		model.forgetPassword = forgetPassword;
		model.msg = null;
		
		function init() {
			// userService
			// 		.checkUserLogin()
			// 		.then(function(result){
			// 			if(result){
			// 				model.loggedUser = result;
			// 				model.error = 'Sorry but you already logged in!';
			// 			}
			// 		});
		}
		init();


		function forgetPassword (email){
			userService
				.findUserByEmail(email)
				.then(function(result){
					if(result !== 'email already exist'){
						model.msg = "Please check your email first; no user under this email!";
			 			return;					
					} else{
						userService
							.forgetPassword(email)
							.then(function(result){
								if(result.data === "ok"){
									model.msg = "Please check your mailbox, an email has been sent, follow the instructios in it.";
								}
							});
						// return result;
			 		}
				});
				

			// userService
			// 		.resetPassword(email)
			// 		.then(function(response){
			// 			console.log(response);
			// 			if(response.data === 'Error'){
			// 				model.msg = "Please check your email first; no user under this email!";
			// 				return;
			// 			} else{
			// 				model.msg = "Please check your mailbox, an email has been already sent, follow the instructios in it.";
			// 				return;
			// 			}
			// 		});
		}


		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}


	}
})();
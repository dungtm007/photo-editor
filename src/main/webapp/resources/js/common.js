"use strict";


$(function () {
	
	if (!photoEditorApp.currentLoadMethod) {
		photoEditorApp.currentLoadMethod = loadHeaderUserSection;
		photoEditorApp.currentUnloadMethod = unloadHeaderUserSection;
	}
	
	function loadHeaderUserSection() {
		
		if (photoEditorApp.curUser) {
		
			// Do similarly with getFbUserDataCallback
			$("#loginControls").hide();
			$("#loginUser").show();
		  
			$("#userName1").text(photoEditorApp.curUser.displayName); // Name 
			$("#userAvatar1").attr("src", photoEditorApp.curUser.photoURL); // Avatar
			$("#userAvatar1").show(); // Avatar
			
			$("#signInText").hide();
			$("#login-dp").removeClass("dropdown-menu").addClass("hidden-menu");
			$("#features-dp").removeClass("hidden-menu").addClass("dropdown-menu");
		}
	}
	
	function unloadHeaderUserSection() {
		
		$("#loginUser").hide();
		$("#loginControls").show();
		
		$("#userName1").text(""); // Name 
		$("#userAvatar1").hide(); // Avatar
		
		$("#signInText").show();
		$("#login-dp").removeClass("hidden-menu").addClass("dropdown-menu");
		$("#features-dp").removeClass("dropdown-menu").addClass("hidden-menu");
	}
	
	$("#signInFB").on("click", function () {

		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			  
			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			var token = result.credential.accessToken;
			console.log("FB Token: " + tokens.substring(token.length - 30, token.length - 1));			
			
		}).catch(function(error) {
			  console.log("(Sign in error) code: " + error.code);
			  console.log("(Sign in error) message: " + error.message);
			  console.log("(Sign in error) email: " + error.email);
			  console.log("(Sign in error) credential: " + error.credential);
		});
		
		// Using session (tab scope) to store credential
		// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
			// .then(function() {
			//	... 
		// });
		
	});
	
	$("#signOut").on("click", function() {
		
		firebase.auth().signOut().then(function() {

			// Remove token
			var data = {
				"userId": photoEditorApp.userId,
				"token": photoEditorApp.token,
				"action": "DELETE"
			};
			
			$.post("token", data)
				.done(function(response) {
						console.log("Success delete token");
				})
				.fail(function(xhr, textStatus, errorThrown ) {
						console.log(errorThrown);
						console.log("Error delete token");
				});
			
			photoEditorApp.clear();
			console.log("Sign out successfully");
		}).catch(function(error) {
			console.log(error);
			console.log("Sign out error !!!");
		});
	});
	
});
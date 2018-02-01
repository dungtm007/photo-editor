"use strict";

$(function () {
	
	function redirectToEditor() {
		$(location).attr('href', 'editor1.jsp');
	}
	
	if (!photoEditorApp.currentPage && !photoEditorApp.currentLoadMethod) {
		photoEditorApp.currentPage = this;
		photoEditorApp.currentLoadMethod = redirectToEditor;
	}
	
	$("#btnLogin, #signInFB").on("click", function () {

		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			  
			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			// var token = result.credential.accessToken;
			console.log("Home Page - Sign in successfully");			
			
		}).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  var email = error.email;
			  var credential = error.credential;
			  console.log("(Sign in error) code: " + errorCode);
			  console.log("(Sign in error) message: " + errorMessage);
			  console.log("(Sign in error) email: " + email);
			  console.log("(Sign in error) credential: " + credential);
		});
		
		// Using session (tab scope) to store credential
		// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
			// .then(function() {
			//	... 
		// });
		
	});
	
});



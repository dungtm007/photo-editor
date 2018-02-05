"use strict";

$(function () {
	
	function redirectToEditor() {
		$(location).attr('href', 'editor.jsp?fbToken=' + photoEditorApp.fbToken);
	}
	
	if (!photoEditorApp.currentPage && !photoEditorApp.currentLoadMethod) {
		photoEditorApp.currentPage = this;
		photoEditorApp.currentLoadMethod = redirectToEditor;
	}
			
	$("#signInFB").on("click", function () {

		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			  
			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			var fbToken = result.credential.accessToken;
			photoEditorApp.fbToken = fbToken;
			console.log("FB Token: " + fbToken.substring(fbToken.length - 30, fbToken.length - 1));		
			console.log("Home Page - Sign in successfully");		
			
		}).catch(function(error) {
			  console.log("(Sign in error): " + error);
			  console.log("(Sign in error) code: " + error.code);
			  console.log("(Sign in error) message: " + error.message);
			  console.log("(Sign in error) email: " + error.email);
			  console.log("(Sign in error) credential: " + error.credential);
		});
		
	});
	
});



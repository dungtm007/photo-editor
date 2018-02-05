"use strict";

function createCanvasImageData(imgElementId) {
	
	var m_canvas = document.createElement('canvas');
	m_canvas.width = $("#" + imgElementId).width();
	m_canvas.height = $("#" + imgElementId).height();
	
	var ctx = m_canvas.getContext('2d');
	ctx.filter = $("#" + imgElementId).css("filter");
	var img = document.getElementById(imgElementId);
	
	ctx.drawImage(img, 0, 0 , m_canvas.width, m_canvas.height);
	var dataURL = m_canvas.toDataURL('image/jpeg');
	return dataURL;
}

$(function () {
	
	// Get FbToken from query string parameter
	var urlParams = new URLSearchParams(window.location.search);
	if (urlParams.get('fbToken')) {
		photoEditorApp.fbToken = urlParams.get('fbToken');
		// Update link to 2 primary pages
		$("#linkToReview").attr("href", "review?fbToken=" + photoEditorApp.fbToken);
		$("#linkToEditor").attr("href", "editor.jsp?fbToken=" + photoEditorApp.fbToken);
	}
	
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
		debugger;

		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			  
			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			var fbToken = result.credential.accessToken;
			photoEditorApp.fbToken = fbToken;
			console.log("FB Token: " + fbToken.substring(fbToken.length - 30, fbToken.length - 1));			
			
		}).catch(function(error) {
			  console.log("(Sign in error): " + error);
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
		debugger;
		firebase.auth().signOut().then(function() {
			debugger;
			// Remove token
			var data = {
				"userId": photoEditorApp.userId,
				"token": photoEditorApp.token,
				//"action": "DELETE"
				"action": "SIGNOUT"
			};
			
			//$.post("token", data)
			$.post("user", data)
				.done(function(response) {
						console.log("Success delete token");
				})
				.fail(function(xhr, textStatus, errorThrown ) {
						console.log(errorThrown);
						console.log("Error delete token");
				});
			
			photoEditorApp.clear();
			console.log("Sign out successfully");
			window.location = "home.jsp";
		}).catch(function(error) {
			console.log(error);
			console.log("Sign out error !!!");
		});
	});
});
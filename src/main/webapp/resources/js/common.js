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

		$(".spinning-loader-container").show();

		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope("publish_actions");
		firebase.auth().signInWithPopup(provider).then(function(result) {			
			var fbToken = result.credential.accessToken;
			photoEditorApp.fbToken = fbToken;
			$("#linkToReview").attr("href", "review?fbToken=" + photoEditorApp.fbToken);
			$("#linkToEditor").attr("href", "editor.jsp?fbToken=" + photoEditorApp.fbToken);
			$(".spinning-loader-container").hide();
		}).catch(function(error) {
			$(".spinning-loader-container").hide();
			$.notify( {message: error }, {
				type: 'danger', allow_dismiss: true, mouse_over: "pause", delay: 1000
			});
		});
	});
	
	$("#signOut").on("click", function() {
		
		$(".spinning-loader-container").show();
		
		firebase.auth().signOut().then(function() {
			var data = {
				"userId": photoEditorApp.userId,
				"token": photoEditorApp.token,
				"action": "SIGNOUT"
			};
			
			$.post("user", data)
				.done(function(response) {
					$(".spinning-loader-container").hide();
					console.log("Sign out successfully");
					photoEditorApp.clear();
					window.location = "home.jsp";
				})
				.fail(function(xhr, textStatus, errorThrown ) {
					$(".spinning-loader-container").hide();
					console.log("Error signing out: " + errorThrown);
				});
		}).catch(function(error) {
			$(".spinning-loader-container").hide();
			console.log("Error signing out: " + error);
		});
	});
});
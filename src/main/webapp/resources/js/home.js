"use strict";

$(function () {
	
	function redirectToEditor() {
		setTimeout(function() {
			$(location).attr('href', 'editor.jsp?fbToken=' + photoEditorApp.fbToken);
		}, 400);
	}
	
	if (!photoEditorApp.currentPage && !photoEditorApp.currentLoadMethod) {
		photoEditorApp.currentPage = this;
		photoEditorApp.currentLoadMethod = redirectToEditor;
	}
			
	$("#signInFB").on("click", function () {

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
	
});



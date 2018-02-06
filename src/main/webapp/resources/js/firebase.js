
$(function () {
	
	// ************************
	// Initialize Firebase
	// ************************
	var config = {
		apiKey: "AIzaSyC6MY3hA_MF565Bbf2g9-957oHJd9RliZw",
		authDomain: "photo-editor-11bc2.firebaseapp.com",
		databaseURL: "https://photo-editor-11bc2.firebaseio.com",
		projectId: "photo-editor-11bc2",
		storageBucket: "photo-editor-11bc2.appspot.com",
		messagingSenderId: "953555425657"
	};
	firebase.initializeApp(config);
	
	
	// **************************************************
	// Track the Auth state across all your pages
	// **************************************************
	var initApp = function() {
		
		firebase.auth().onAuthStateChanged(function(user) {
			
		  if (user) {
			  user.getIdToken().then(function(accessToken) {
				
				  // Save user to DB (if not signed in) and update token
				  var data = {
					"oauthProvider": user.providerData[0].providerId,
					"oauthUid": user.providerData[0].uid,
					"displayName": user.displayName,
					"email": user.providerData[0].email,
					"photoUrl": user.photoURL,
					"token": accessToken,
					"fbToken": photoEditorApp.fbToken,
					"action": "SIGNIN"
				  };
				  
				  console.log("fbToken:" + photoEditorApp.fbToken);
				
				  $.post("user", data)
					.done(function(response) {
						photoEditorApp.userId = response.userId;
						photoEditorApp.token = accessToken;
						photoEditorApp.curUser = user;
						if (response.fbToken) {
							photoEditorApp.fbToken = response.fbToken;
						}
						if (photoEditorApp.currentLoadMethod) {
							photoEditorApp.currentLoadMethod();
						}
					})
					.fail(function(xhr, textStatus, errorThrown ) {
						console.log(errorThrown);
					});
			});
		  } else {
				// User is signed out
			  	if (photoEditorApp.currentUnloadMethod) {
			  		photoEditorApp.currentUnloadMethod();
			  	}
		  }
		}, function(error) {
		  console.log(error);
		});
	};
	
	initApp();
});




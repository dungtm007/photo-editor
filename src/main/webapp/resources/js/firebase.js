
// Dependencies:
// - Firebase 
// - Firebase UI 

// Initialize Firebase
var config = {
	apiKey: "AIzaSyC6MY3hA_MF565Bbf2g9-957oHJd9RliZw",
	authDomain: "photo-editor-11bc2.firebaseapp.com",
	databaseURL: "https://photo-editor-11bc2.firebaseio.com",
	projectId: "photo-editor-11bc2",
	storageBucket: "photo-editor-11bc2.appspot.com",
	messagingSenderId: "953555425657"
};
firebase.initializeApp(config);

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccess: function(currentUser, credential, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
	  alert("Success");
	  console.log(currentUser);
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'http://localhost:8501/editor.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
	firebase.auth.TwitterAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: 'http://localhost:8501/editor.html'
};

// The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', uiConfig);

// Track the Auth state across all your pages
var initApp = function() {
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		// User is signed in.
		var displayName = user.displayName;
		var email = user.email;
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var uid = user.uid;
		var phoneNumber = user.phoneNumber;
		var providerData = user.providerData;
		user.getIdToken().then(function(accessToken) {
		  
			console.log("Auth State Changed");
			
			// Save user to DB (if not signed in)
			var data = {
					"oauthProvider": user.providerData[0].providerId,
					"oauthUid": user.providerData[0].uid,
					"displayName": user.displayName,
					"email": user.providerData[0].email,
					"photoUrl": user.photoURL
			};
			
			$.post("user", data)
				.done(function(response) {
					console.log("success");
					photoEditorApp.userId = response.userId;
				})
				.fail(function() {
					console.log("error");
				});
			
			
			// Do similarly with getFbUserDataCallback
			$("#loginControls").hide();
			$("#loginUser").show();
		  
			$("#userName1").text(user.displayName); // Name 
			$("#userAvatar1").attr("src", user.photoURL); // Avatar
			$("#userAvatar1").show(); // Avatar
			
			$("#signInText").hide();
			$("#login-dp").removeClass("dropdown-menu").addClass("hidden-menu");
			$("#features-dp").removeClass("hidden-menu").addClass("dropdown-menu");
		});
	  } else {
			// User is signed out.

			$("#loginUser").hide();
			$("#loginControls").show();
			
			$("#userName1").text(""); // Name 
			$("#userAvatar1").hide(); // Avatar
			//$("#userAvatar1").attr("src", ""); // Avatar
			
			$("#signInText").show();
			$("#login-dp").removeClass("hidden-menu").addClass("dropdown-menu");
			$("#features-dp").removeClass("dropdown-menu").addClass("hidden-menu");
	  }
	}, function(error) {
	  console.log(error);
	});
};

// $(function() {
	// initApp();
// });

window.addEventListener('load', function() {
	initApp();
});







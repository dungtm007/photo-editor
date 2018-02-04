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
	
	function loadImageToCanvas() {
		
		var canvas = $("#canvas")[0];
		var ctx = canvas.getContext("2d");
		var img = $("#imageToEdit");
		canvas.width = img.width(); 
		canvas.height = img.height();
		ctx.drawImage(img[0], 0, 0, canvas.width, canvas.height);
	}
	
	function loadBackgroundToSamples(src) {
		
		var img = $("#imageToEdit");
		$(".sampleImage").each(function() {	
			$(this).css({
				"background-image": "url(" + img[0].src + ")",
				"background-position": "center center",
			});
		});
	}
	
	function applyFilterImg() {
		
		var filter = "";
		
		$("input[type='range'").each(function() {
			
			var filterType = $(this).attr("data-filter");
			var value = $(this).val();
			var unit = $(this).attr("data-unit");
			
			filter += `${filterType}(${value}${unit}) `;
		});
		
		$("#imageToEdit").css("filter", filter);
	}
	
	function resetOriginal() {
		
		// blur: 0, brightness: 100, contrast: 100, grayscale: 0, hue-rotate: 0
		// invert: 0, opacity: 100, saturate: 100, sepia: 0
		
		for(const filterType in photoEditorApp.defaultValues) {
			$(`#${filterType}`).val(photoEditorApp.defaultValues[filterType]);
		}
		applyFilterImg();
	}
	
	$("input[type='range']").on("change", function () {
		applyFilterImg();
	});
	
	$("#btnReset").on("click", function () {
		resetOriginal();
	});
	
	$("#btnSaveModified").on("click", function () {
		
		var title = "";
		while(!title) {
			title = prompt("Title of image (required)?");	
			if (title == null) { // Cancel
				return;
			}
		}
		
		var dataURL = createCanvasImageData();
		
		// Save user to DB
		var data = {
				"userId": photoEditorApp.userId,
				"token": photoEditorApp.token,
				"imageData": dataURL, // dataURL.split(',')[1],
				"photoId": photoEditorApp.curPhotoId || -1,
				"photoTitle": title
		};
		
		$.post("photo", data)
			.done(function(response) {
				console.log("Success upload photo to server");
				photoEditorApp.curPhotoId = response.photoId;
				alert("Success");
			})
			.fail(function(xhr, textStatus, errorThrown ) {
				console.log(errorThrown);
				console.log("Error upload photot to server");
				alert("Error");
			});
		
	});
	
	function dataURLtoByteArray(dataURL) {
		
		var byteString = atob(dataURL.split(',')[1]); // remove 'base64...,'
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return ia;
	}
	
	
	$("#btnShare").on("click", function () {
		
		var canvas = $("#canvas")[0];
		var dataURL = canvas.toDataURL('image/jpeg');
		FacebookConnector.postImage(dataURL);
		
	});
	
	$("#btnDownload, #lnkDownload").on("click", function () {
		this.href = createCanvasImageData();
	});
	
	function createCanvasImageData() {
		
		var m_canvas = document.createElement('canvas');
		m_canvas.width = $("#imageToEdit").width();
		m_canvas.height = $("#imageToEdit").height();
		
		var ctx = m_canvas.getContext('2d');
		ctx.filter = $("#imageToEdit").css("filter");
		var img = document.getElementById("imageToEdit");
		
		ctx.drawImage(img, 0, 0 , m_canvas.width, m_canvas.height);
		var dataURL = m_canvas.toDataURL('image/jpeg');
		return dataURL;
	}
	
	$("#custom").on("click", function () {
		$("#editorControls").show();
		$("#editorPresets").hide();
	});
	
	$("#preset").on("click", function () {
		$("#editorPresets").show();
		$("#editorControls").hide();
	});
	
	$("#uploadedFile").on("change", function(e) {
		
		resetOriginal();
		
		var target = e.originalEvent.target || e.originalEvent.srcElement;
		var file = target.files[0];
		var img = $("#imageToEdit")[0];
		var reader = new FileReader();
		reader.onloadend = function() {
			img.src = reader.result;
		}
		reader.readAsDataURL(file);
		
		photoEditorApp.curPhotoId = null;
	});
	
	$("#imageToEdit").on("load", function() {
		
		loadBackgroundToSamples();
		
		// Show image and editor section
		$("#imageToEdit").show();
		$("#editor").show();
	});
	
	
	$(".sampleImage").on("click", function () {

		var preset = Object.assign({}, photoEditorApp.defaultValues);
		preset = Object.assign(preset, photoEditorApp.presets[$(this).attr("id")]);

		for(const filterType in preset) {
			$(`#${filterType}`).val(preset[filterType]);
		}
		
		applyFilterImg();
	});
	
	$("#btnLogin, #signInFB").on("click", function () {

		// Using session to store credential
//		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
//		 .then(function() {
			 
			var provider = new firebase.auth.FacebookAuthProvider();
			firebase.auth().signInWithPopup(provider).then(function(result) {
				  
				// This gives you a Facebook Access Token. You can use it to access the Facebook API.
				var token = result.credential.accessToken;
				console.log("FB Token: " + tokens.substring(token.length - 30, token.length - 1));			
				
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
		
//		 });
		
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
				"token": photoEditorApp.token
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



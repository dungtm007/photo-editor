<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>


<html>
	<head>
		<meta charset="utf-8" />
		<title>Photo Editor</title>
		
		<!-- jQuery -->
		<script src="jquery-3.3.1.min.js"></script>
		
		<!-- Bootstrap -->
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		
		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

		<!-- Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
		
		<!-- Font Awesome -->
		<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
		
		<!-- Load Facebook SDK -->
		
		<!-- Photo Editor App -->
		<script src="application.js"></script>
		
		<!-- Firebase libs -->
		<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-app.js"></script>
		<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-auth.js"></script> <!--authentication-->
		<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-database.js"></script>
		<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-firestore.js"></script>
		<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-messaging.js"></script>
		<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-storage.js"></script>
		
		<!-- Firebase UI -->
		<script src="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.js"></script>
		<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.css" />
		
		<!-- Application's CSS -->
		<link rel="stylesheet" href="editor.css" />
		<link rel="stylesheet" href="login-section.css" />
		
	</head>
	
	<body>
	
		<!--Firebase-->
		<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>
		<script>
			// Initialize Firebase
			// ...
		</script>
		
		<div id="firebaseui-auth-container"></div>
		
		<nav class="navbar navbar-default navbar-inverse navbar-fixed-top" role="navigation">
			
			<div id="navbarContainer" class="container-fluid">
			
			<span class="siteName">Photo Editor</span>
					
				<ul id="loginMenu" class="nav navbar-nav navbar-right">
				
					<li> 
						<img id="userAvatar1" class="profile-img" src="" alt="user avatar" />
						<span class="navbar-text" id="userName1"></span>
					</li>
				
					<li class="dropdown">
						<a id="signInLink" href="#" class="dropdown-toggle" data-toggle="dropdown"><span id="signInText">Sign in</span> <span class="caret"></span></a>
						
						
						<ul id="login-dp" class="dropdown-menu">
							<li>
								 <div class="row">
										<div class="col-md-12">
											<!-- <div class="social-buttons"> -->
												<!-- <a href="#" class="btn btn-fb"><i class="fa fa-facebook"></i> Facebook</a> -->
												<!-- <a href="#" class="btn btn-tw"><i class="fa fa-twitter"></i> Twitter</a> -->
											<!-- </div> -->
											<div class="text-center">
												<a id="signInFB" href="#" class="btn btn-fb social-button"><i class="fa fa-facebook"></i> Facebook</a>
											</div>
											<div class="text-center">
												<a href="#" class="btn btn-tw social-button"><i class="fa fa-twitter"></i> Twitter</a>
											</div>
										</div>
										<!-- <div class="bottom text-center"> -->
											<!-- <a href="#" class="btn btn-tw"><i class="fa fa-twitter"></i> Twitter</a> -->
										<!-- </div> -->
								 </div>
							</li>
						</ul>
						
						<ul id="features-dp" class="hidden-menu">
							<li>
								 <div class="row">
										<div class="feature-item">
											Saved Photos
										</div>
										<div id="signOut" class="feature-item">
											Sign out
										</div>
								 </div>
							</li>
						</ul>
					</li>
				</ul>
				
			</div>
		</nav>
		
		
		
		<!-- <div id="loginDiv"> -->
			<!-- <div id="loginControls"> -->
				<!-- <button id="btnLogin">Login</button> -->
			<!-- </div> -->
			<!-- <div id="loginUser"> -->
				<!-- <div> -->
					<!-- <a href="#" title="Profile"> -->
						<!-- <span> -->
							<!-- <img id="userAvatar" src="" alt="" /> -->
							<!-- <span id="userName"></span> -->
						<!-- </span> -->
					<!-- </a> -->
				<!-- </div> -->
				<!-- <div> -->
					<!-- <button id="btnLogout">Logout</button> -->
				<!-- </div> -->
			<!-- </div> -->
		<!-- </div> -->
		
		
		
		<div id="uploadDiv">
			Upload image: <input type="file" id="uploadedFile" />
		</div>
		
		<main>
			<div id="editor">
			
				<div>
					<ul id="editMode">
						<li id="preset">Preset</li>
						<li id="custom">Custom</li>
					</ul>
					
				</div>
				
				<div id="editorControls">
					<p>
						Blur <input type="range" id="blur" 
								min="0" max="10" value="0"
								data-filter="blur" 
								data-unit="px" />
					</p>
					<p>
						Brightness <input type="range" id="brightness" 
										min="30" max="200" value="100"
										data-filter="brightness"
										data-unit="%" />
					</p>
					<p>
						Contrast <input type="range" id="contrast" 
									min="30" max="200" value="100"
									data-filter="contrast"
									data-unit="%" />
					</p>
					<p>
						Grayscale <input type="range" id="grayscale" 
									min="0" max="100" value="0"
									data-filter="grayscale" 
									data-unit="%" />
					</p>
					<p>
						Hue Rotate <input type="range" id="hueRotate" 
										min="0" max="350" value="0"
										data-filter="hue-rotate"
										data-unit="deg" />
					</p>
					<p>
						Invert <input type="range" id="invert" 
									min="0" max="100" value="0"
									data-filter="invert" 
									data-unit="%" />
					</p>
					<p>
						Opacity <input type="range" id="opacity"
									min="40" max="100" value="100"
									data-filter="opacity"
									data-unit="%" />
					</p>
					<p>
						Saturate <input type="range" id="saturate" 
									min="0" max="250" value="100"
									data-filter="saturate"
 									data-unit="%" />
					</p>
					<p>
						Sepia <input type="range" id="sepia" 
									min="0" max="100" value="0"
									data-filter="sepia"
									data-unit="%" />
					</p>
					<div>
						<button id="btnReset">Reset</button>
					</div>
				</div>
				
				<div id="editorPresets">
					<!-- 
						Willow
						Walden
						Valencia
						
						Toaster
						Sierra
						Nashville
						
						Lo-Fi
						Kelvin
						Rise
					
					-->
					
					<div>
						<div id="willow" class="sampleImage willow"></div>
						<div id="y1977" class="sampleImage y1977"></div>
						<div id="rise" class="sampleImage rise"></div>

					</div>
					<div>
						<p class="presetName">Willow</p>
						<p class="presetName">1977</p>
						<p class="presetName">Rise</p>
					</div>
					
					<div>
						<div id="sierra" class="sampleImage sierra"></div>
						<div id="valencia" class="sampleImage valencia"></div>
						<div id="loFi" class="sampleImage lofi"></div>
					</div>
					<div>
						<p class="presetName">Sierra</p>
						<p class="presetName">Valencia</p>
						<p class="presetName">Lo-Fi</p>
					</div>
					
					<div>
						<div id="earlyBird" class="sampleImage earlybird"></div>
						<div id="walden" class="sampleImage walden"></div>
						<div id="xPro2" class="sampleImage xpro2"></div>
						
						
					</div>
					<div>
						<p class="presetName">Early Bird</p>
						<p class="presetName">Walden</p>
						<p class="presetName">XPro-2</p>
					</div>
					
					<div>
						<div id="nashville" class="sampleImage nashville"></div>
						<div id="toaster" class="sampleImage toaster"></div>
						<div id="kelvin" class="sampleImage kelvin"></div>
					</div>
					<div>
						<p class="presetName">Nashville</p>
						<p class="presetName">Toaster</p>
						<p class="presetName">Kelvin</p>
					</div>
					
				</div>
				
				<div id="processDiv">
					<!-- <div> -->
						<!-- <button id="btnSaveModified">Save</button> -->
					<!-- </div> -->
					
					<!-- <div> -->
						<!-- <button id="btnShare">Share</button> -->
					<!-- </div> -->
					
					<div>
						<!-- <button id="btnDownload">Download</button> -->
						<button id="btnSaveModified">Save</button>
						<button id="btnShare">Share</button>
						<a id="lnkDownload" href="#" target="_blank" download="editedImage.jpg">Download</a>
					</div>
				</div>
				
			</div>
		
			<div id="imageStage">
				<br/>
				<img id="imageToEdit" alt="Image to edit"/>
			</div>
			
			
		</main>
		<script src="firebase.js"></script>
		<script src="editor.js"></script>
	</body>	
</html>
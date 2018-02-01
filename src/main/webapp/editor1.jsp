<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
    
<t:wrapper>
    
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
	<script src="editor.js"></script>
    
</t:wrapper>
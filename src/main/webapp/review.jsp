
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:wrapper>
<link rel="stylesheet" href="<c:url value='/resources/css/review.css'/>" />
<div class="container">
  <div class="buttongroup">
    <button type="button" class="btn btn-info">Original</button>
    <button type="button" class="btn btn-info">Modified</button>
  </div>
	<div id="photosContainer" class="row">
		<div class="gallery">
			<c:forEach var="photo" items="${photos}">
			  <figure>
			    <img src="${photo.imageData}" alt="${photo.title}" />
			    <figcaption>${photo.title} 
			    	<small>${photo.created}</small>
			    		<a href="${photo.imageData}" download="${photo.title}">Download</a>
			    	<a>Share</a>
			    </figcaption>
			  </figure>
			 </c:forEach>
		</div>
	</div>
</div>
</t:wrapper>
<script src="<c:url value='/resources/js/review.js'/>"></script>


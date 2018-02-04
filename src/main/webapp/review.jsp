
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%--  <link rel="stylesheet" type="text/css" href="https://getbootstrap.com/dist/css/bootstrap.min.css">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
--%>

<t:wrapper>
<link rel="stylesheet" href="<c:url value='/resources/css/review.css'/>" />
<div class="container">
  <div class="buttongroup">
    <button type="button" class="btn btn-info">Original</button>
    <button type="button" class="btn btn-info">Modified</button>
  </div>
	<div class="row">
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
		  <figure>
		    <img src="https://images.unsplash.com/photo-1448814100339-234df1d4005d?crop=entropy&fit=crop&fm=jpg&h=200&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=300" alt="" />
		    <figcaption>Daytona Beach <small>United States</small></figcaption>
		  </figure>
		 </c:forEach>
		</div>
	</div>
</div>
</t:wrapper>
<script src="<c:url value='/resources/js/review.js'/>"></script>



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
    <img src="${photo.imageData}" alt="error" />
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


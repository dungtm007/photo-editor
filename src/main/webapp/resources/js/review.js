"use strict";
var currentFigure;
var popup = {
  init: function() {
	  $('figure').click(function(){
		  currentFigure = this;
		  popup.open($(this));
	  });
    
    $(document).on('click', ".popup #downloadImg", function(event) {
    	//debugger;
    	event.stopPropagation(); // do not bubble it in DOM tree, so normal behavior of download button is maintained 
    })
    .on('click', '.popup #figPopup', function() {
    	//debugger;
      return false; // prevent default and stop propagation
    })
    .on('click', '.popup', function(){
    	//debugger;
      popup.close();
    }).on('click', '.popup #deleteImg', function(e, f){
    	var id = this.getAttribute("data-value");
    	//console.log("Delete Image: "+ e);
    	popup.deleteImg(id);
    });
    
    $(document).on("click", "#shareImg, #shareImgIcon", function(){
		$(".spinning-loader-container").show();
		FacebookConnector.setAccessToken(photoEditorApp.fbToken);
		FacebookConnector.postImage(createCanvasImageData("imgPopup"), postImageCallback, postImageFail);
	});
	
	function postImageCallback() {
		$(".spinning-loader-container").hide();
		$.notify( {message: 'Posted Successfully' }, {
			type: 'success', allow_dismiss: true, mouse_over: "pause", delay: 1000, z_index: 10000
		});
	}
	
	function postImageFail() {
		$(".spinning-loader-container").hide();
		$.notify( {message: 'Error' }, {
			type: 'danger', allow_dismiss: true, mouse_over: "pause", delay: 1000, z_index: 10000
		});
	}
    
  },
  open: function($figure) {
    var $popup = $('<div class="popup" />').appendTo($('body'));
    var $fig = $figure.clone().appendTo($('.popup'));
    $fig.attr("id", "figPopup");
    var $bg = $('<div class="bg" />').appendTo($('.popup'));
    //var $close = $('<div class="close"><svg><use xlink:href="#close"></use></svg></div>').appendTo($fig);
    var $shadow = $('<div class="shadow" />').appendTo($fig);
    var $img = $('img', $fig);
    var src =  $img.attr('src');
    $img.attr("id", "imgPopup");
    $shadow.css({backgroundImage: 'url(' + src + ')'});
    $bg.css({backgroundImage: 'url(' + src + ')'});
    setTimeout(function(){
      $('.popup').addClass('pop');
    }, 10);
  },
  close: function() {
    $('.gallery, .popup').removeClass('pop');
    setTimeout(function(){
      $('.popup').remove()
    }, 100);
  },
  deleteImg: function(id){
	  $.post("photo", {"action": "DELETE", "id": id})
		.done(function(response) {
			popup.close();
			$.notify( {message: 'Delete image Successfully' }, {
				type: 'success', allow_dismiss: true, mouse_over: "pause", delay: 1000
			});
			setTimeout(function(){
				currentFigure.remove();
			}, 10);
		})
		.fail(function(xhr, textStatus, errorThrown ) {
			console.log("Error delete image: " + errorThrown);
		});
  }
};

popup.init();



/*$(function(){
	
	$(document).on("click", "#shareImg, #shareImgIcon", function(){
		$(".spinning-loader-container").show();
		FacebookConnector.setAccessToken(photoEditorApp.fbToken);
		FacebookConnector.postImage(createCanvasImageData("imgPopup"), postImageCallback, postImageFail);
	});
	
	function postImageCallback() {
		$(".spinning-loader-container").hide();
		$.notify( {message: 'Posted Successfully' }, {
			type: 'success', allow_dismiss: true, mouse_over: "pause", delay: 1000, z_index: 10000
		});
	}
	
	function postImageFail() {
		$(".spinning-loader-container").hide();
		$.notify( {message: 'Error' }, {
			type: 'danger', allow_dismiss: true, mouse_over: "pause", delay: 1000, z_index: 10000
		});
	}
});*/



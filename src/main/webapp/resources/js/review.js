"use strict";

var popup = {
  init: function() {
    
	  $('figure').click(function(){
		  popup.open($(this));
	  });
    
    $(document).on('click', ".popup #downloadImg", function(event) {
    	event.stopPropagation(); // do not bubble it in DOM tree, so normal behavior of download button is maintained 
    })
    .on('click', '.popup #figPopup', function() {
      return false; // prevent default and stop propagation
    })
    .on('click', '.popup', function(){
      popup.close();
    });
    
  },
  open: function($figure) {
    var $popup = $('<div class="popup" />').appendTo($('body'));
    var $fig = $figure.clone().appendTo($('.popup'));
    $fig.attr("id", "figPopup");
    var $bg = $('<div class="bg" />').appendTo($('.popup'));
    var $close = $('<div class="close"><svg><use xlink:href="#close"></use></svg></div>').appendTo($fig);
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
  close: function(){
    $('.gallery, .popup').removeClass('pop');
    setTimeout(function(){
      $('.popup').remove()
    }, 100);
  },
};

popup.init();



$(function(){
	
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
});



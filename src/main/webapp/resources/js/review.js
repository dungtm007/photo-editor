popup = {
  init: function() {
    $('figure').click(function(){
      popup.open($(this));
    });
    
    $(document).on('click', '.popup img', function(){
      return false;
    }).on('click', '.popup', function(){
      popup.close();
    })
  },
  open: function($figure) {
    $('.gallery').addClass('pop');
    $popup = $('<div class="popup" />').appendTo($('body'));
    $fig = $figure.clone().appendTo($('.popup'));
    $bg = $('<div class="bg" />').appendTo($('.popup'));
    $close = $('<div class="close"><svg><use xlink:href="#close"></use></svg></div>').appendTo($fig);
    $shadow = $('<div class="shadow" />').appendTo($fig);
    src = $('img', $fig).attr('src');
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
  
  linkDownload: function(){
	  
  },
  
}

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

popup.init()
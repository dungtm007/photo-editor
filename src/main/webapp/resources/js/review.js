"use strict";
var popup = {
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
    var $popup = $('<div class="popup" />').appendTo($('body'));
    var $fig = $figure.clone().appendTo($('.popup'));
    var $bg = $('<div class="bg" />').appendTo($('.popup'));
    var $close = $('<div class="close"><svg><use xlink:href="#close"></use></svg></div>').appendTo($fig);
    var $shadow = $('<div class="shadow" />').appendTo($fig);
    var src = $('img', $fig).attr('src');
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
}

popup.init()
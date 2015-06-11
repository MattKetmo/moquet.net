$(function() {

'use strict';

// Start translation only after page load
// @see http://css-tricks.com/transitions-only-after-page-load/
var $body = $('body');
setTimeout(function() {
  $body.removeClass("preload");
}, 0);

// Blog post
$('.Type').find('h1, h2, h3, h4, h5').anchorify({
  text: '<i class="icon-link"></i>'
});
$('.Type pre').on('dblclick', function() {
  var range = document.createRange();
  range.selectNode(this);
  window.getSelection().addRange(range);
});
$('.Type a').fluidbox({
  closeTrigger: [
    { selector: 'window', event: 'resize scroll' },
  ]
});

// Twitter share button
$('.js-twitter-share').on('click', function(e) {
  e.preventDefault();
  var url = $(this).attr('href');
  window.open(url, 'Twitter', 'height=300,width=550');
});

// Start highlight.js
hljs.initHighlightingOnLoad();


// Postload animation
$('a').on('click', function(e) {
  var $this = $(this);
  var href = $this.attr('href');

  if (href.indexOf('/') === 0) {
    e.preventDefault();
    $body.addClass('postload');
    setTimeout(function() {
      window.location.href = href;
    }, 500);
  }
});

});


// Start translation only after page load
// @see http://css-tricks.com/transitions-only-after-page-load/
$(function() {
    $("body").removeClass("preload");
});

// Blog post
$('.Type').find('h1, h2, h3, h4, h5').anchorify({
  text: '<i class="icon-link"></i>'
});
$('.Type pre').on('dblclick', function() {
  var range = document.createRange();
  range.selectNode(this);
  window.getSelection().addRange(range);
});


// Twitter share button
$('.js-twitter-share').on('click', function(e) {
  e.preventDefault();
  var url = $(this).attr('href');
  window.open(url, 'Twitter', 'height=300,width=550');
});

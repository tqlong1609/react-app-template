import $ from 'jquery';

$(document).ready(function () {
  $(window).resize(function () {
    if ($(window).width() >= 1024) {
      $('body').addClass('sidebar-collapse');
    }
  });
});

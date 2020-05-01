document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById("toggle-menu");
  var nav = document.getElementById("nav");

  toggle.addEventListener('click', function () {
    nav.classList.toggle('responsive');
  });
});

/*
$(document).ready(function() {
  var toggle = $("#toggle-menu");
  var nav = $("#nav");

  toggle.click(function() {
    nav.toggleClass('responsive');
  });
});
*/
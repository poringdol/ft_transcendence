// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("underscore")
require("backbone")
require("jquery")

global.$ = global.jQuery = $;
window.$ = window.jQuery = $;
global._ = global.underscore = _;
window._ = window.underscore = _;

import "bootstrap"
import '../stylesheets/application'

document.addEventListener("DOMContentLoaded", function(event) {
	var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
	var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
	  return new bootstrap.Popover(popoverTriggerEl)
	})

	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	  return new bootstrap.Tooltip(tooltipTriggerEl)
	})
});

document.addEventListener("turbolinks:before-visit", function () {
	Turbolinks.clearCache();
})

Notification.requestPermission().then(function (result) {})

//$(document).on('turbolinks:load', function(){ $.rails.refreshCSRFTokens(); });

// debugger

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

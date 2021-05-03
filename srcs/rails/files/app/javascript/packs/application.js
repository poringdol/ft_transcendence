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

$(document).on('turbolinks:load', function(){
    const CSRF_TOKEN1 = document.querySelector('meta[name="csrf-token"]').content;
    console.log(CSRF_TOKEN1)
    $.ajaxSetup({
        headers: {'X-CSRFToken': CSRF_TOKEN1}
    });

    var oldSync = Backbone.sync;
    Backbone.sync = function(method, model, options){
        const CSRF_TOKEN2 = document.querySelector('meta[name="csrf-token"]').content;
        console.log("sync" + CSRF_TOKEN2)
        options.beforeSend = function(xhr){
            xhr.setRequestHeader('X-CSRFToken', CSRF_TOKEN2);
        };
        return oldSync(method, model, options);
    };
});

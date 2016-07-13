import $ from 'jquery';
$.noConflict();
jQuery( document ).ready(function( $ ) {
    // Code that uses jQuery's $ can follow here.
    $('.owl-carousel').owlCarousel({
        loop:true,
        items:1,
        margin:0,
        nav:true,
        navText:["next","prev"]
    })
});
import $ from 'jquery';
$.noConflict();
jQuery( document ).ready(function( $ ) {
    // Code that uses jQuery's $ can follow here.
    $('.b-testimonials .owl-carousel').owlCarousel({
        autoPlay:7000,
        items:1,
        margin:0,
        singleItem:true,
        navigation:true,
        navigationText : ["&laquo;","&raquo;"],
        pagination: true,
        stopOnHover: true
    });
});
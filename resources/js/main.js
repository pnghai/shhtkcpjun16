//import $ from 'jquery';
jQuery.noConflict();
jQuery( document ).ready(function( $ ) {
    // Code that uses jQuery's $ can follow here.
    $('.b-testimonials .owl-carousel').owlCarousel({
        autoPlay:3000,
        items:1,
        margin:0,
        singleItem:true,
        navigation:true,
        navigationText : ["&laquo;","&raquo;"],
        pagination: true,
        stopOnHover: true
    });
});
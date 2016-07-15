(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.noConflict();
jQuery(document).ready(function ($) {
    // Code that uses jQuery's $ can follow here.
    $('.b-testimonials .owl-carousel').owlCarousel({
        autoPlay: 3000,
        items: 1,
        margin: 0,
        singleItem: true,
        navigation: true,
        navigationText: ["&laquo;", "&raquo;"],
        pagination: true,
        stopOnHover: true
    });
});

},{"jquery":"jquery"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXNvdXJjZXMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUNBLGlCQUFFLFVBQUY7QUFDQSxPQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FBeUIsVUFBVSxDQUFWLEVBQWM7O0FBRW5DLE1BQUUsK0JBQUYsRUFBbUMsV0FBbkMsQ0FBK0M7QUFDM0Msa0JBQVMsSUFEa0M7QUFFM0MsZUFBTSxDQUZxQztBQUczQyxnQkFBTyxDQUhvQztBQUkzQyxvQkFBVyxJQUpnQztBQUszQyxvQkFBVyxJQUxnQztBQU0zQyx3QkFBaUIsQ0FBQyxTQUFELEVBQVcsU0FBWCxDQU4wQjtBQU8zQyxvQkFBWSxJQVArQjtBQVEzQyxxQkFBYTtBQVI4QixLQUEvQztBQVVILENBWkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbiQubm9Db25mbGljdCgpO1xualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KGZ1bmN0aW9uKCAkICkge1xuICAgIC8vIENvZGUgdGhhdCB1c2VzIGpRdWVyeSdzICQgY2FuIGZvbGxvdyBoZXJlLlxuICAgICQoJy5iLXRlc3RpbW9uaWFscyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xuICAgICAgICBhdXRvUGxheTozMDAwLFxuICAgICAgICBpdGVtczoxLFxuICAgICAgICBtYXJnaW46MCxcbiAgICAgICAgc2luZ2xlSXRlbTp0cnVlLFxuICAgICAgICBuYXZpZ2F0aW9uOnRydWUsXG4gICAgICAgIG5hdmlnYXRpb25UZXh0IDogW1wiJmxhcXVvO1wiLFwiJnJhcXVvO1wiXSxcbiAgICAgICAgcGFnaW5hdGlvbjogdHJ1ZSxcbiAgICAgICAgc3RvcE9uSG92ZXI6IHRydWVcbiAgICB9KTtcbn0pOyJdfQ==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('./utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _events = require('./utils/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require('jquery');
var Exoskeleton = require('exoskeleton');

require('respimage');

exports.default = function () {
	'use strict';

	// ----------------------------------
	// GLOBAL NAMESPACE
	// ----------------------------------

	// Save a reference to the global object

	var root = window;
	root.Backbone = {};
	root.Backbone.$ = $;

	// @borrow objects
	var App = root.App = _helpers2.default.extend(window.App || {}, {
		Vent: _helpers2.default.extend({}, Exoskeleton.Events)
	});

	// Add globals
	App.Exoskeleton = Exoskeleton;
	App.$ = $;
	App.EVENTS = _events2.default;

	/**
  * Create custom view with own properties and
  * take this view in our modules
  * register only one reference to our global library Exoskeleton
  */
	App.ComponentView = function (options) {
		Exoskeleton.View.call(this, options);
	};
	App.ComponentModel = function (options) {
		Exoskeleton.Model.call(this, options);
	};
	App.ComponentCollection = function (options) {
		Exoskeleton.Collection.call(this, options);
	};

	_helpers2.default.extend(App.ComponentView.prototype, Exoskeleton.View.prototype, {});
	_helpers2.default.extend(App.ComponentModel.prototype, Exoskeleton.Model.prototype, {});
	_helpers2.default.extend(App.ComponentCollection.prototype, Exoskeleton.Collection.prototype, {});

	App.ComponentView.extend = Exoskeleton.View.extend;
	App.ComponentModel.extend = Exoskeleton.Model.extend;
	App.ComponentCollection.extend = Exoskeleton.Collection.extend;

	/**
  * Add our Mixin to our View object.
  */
	App.ComponentView.classMixin = _helpers2.default.classMixin;

	// Feature detection
	App.support = App.support || {};
	App.support.touch = _helpers2.default.isTouch();
	App.clickHandler = _helpers2.default.clickHandler();

	// Versioning
	App.version = "0.0.1";

	// Media Query
	var head = document.querySelectorAll('head');
	App.currentMedia = window.getComputedStyle(head[0], null).getPropertyValue('font-family');

	// Screen Size
	App.screenSize = {
		width: root.innerWidth,
		height: root.innerHeight
	};

	// ----------------------------------
	// CHECKING
	// ----------------------------------

	// disable devmode logging if not on ie9 and parameter "devmode" not present
	if (document.querySelectorAll('html')[0].className.indexOf('ie9') < 0) {
		if (document.location.search.indexOf('devmode') < 0) {
			// hide all warnings and logs if not in devmode
			console.log = console.warn = function () {};
		} else {
			App.devmode = true;
		}
	} else {
		// IE9 FIX: in ie9 window.console seems to be undefined until you open dev tools
		if (!window.console) {
			window.console = {};
			console.log = console.warn = function () {};
		}
	}

	// ----------------------------------
	// GLOBAL EVENTS
	// ----------------------------------

	/**
  * Triggers
  */

	// Trigger global resize event
	window.onresize = function (e) {
		var currentMedia = window.getComputedStyle(head[0], null).getPropertyValue('font-family');
		var width = window.innerWidth;

		if (currentMedia !== App.currentMedia) {
			var oldMedia = App.currentMedia;

			App.currentMedia = currentMedia;
			console.log('App.currentMedia: ', App.currentMedia);

			App.Vent.trigger(App.EVENTS.mediachange, {
				type: App.EVENTS.mediachange,
				currentMedia: currentMedia,
				oldMedia: oldMedia
			});
		}

		if (width != App.screenSize.width) {
			App.screenSize.width = width;
			App.Vent.trigger(App.EVENTS.resize, e);
		}
	};

	document.onscroll = function (e) {
		App.Vent.trigger(App.EVENTS.scroll, e);
	};

	return App;
}.call(undefined);

},{"./utils/events":3,"./utils/helpers":4,"exoskeleton":"exoskeleton","jquery":"jquery","respimage":"respimage"}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Main Requirements


var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _helpers = require('./utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ES6 Modules

// @INSERTPOINT :: @ref: js-import

// Vars
var $ = _app2.default.$;

'use strict';

// Main Functionality

var Core = function () {
	function Core() {
		_classCallCheck(this, Core);

		this.initialize();
	}

	/**
  * Initialize our core functionality
  * This function will only be executed once.
  */


	_createClass(Core, [{
		key: 'initialize',
		value: function initialize() {
			console.log('App initialized with version: ', _app2.default.version);

			/**
    * Detect Touch
    */
			if (!_app2.default.support.touch) {
				$('html').addClass('no-touch');
			} else {
				$('html').addClass('touch');
			}

			// Redirect
			_app2.default.Vent.on(_app2.default.EVENTS.DOMredirect, function (obj) {
				if (!obj && !obj.url) throw new Error('Object is not defined. Please provide an url in your object!');

				// Redirect to page
				window.location.href = String(obj.url);
			});

			// @INSERTPOINT :: @ref: js-init-once-v3
		}
	}, {
		key: 'preRender',
		value: function preRender() {
			_helpers2.default.saveDOM();
		}
	}, {
		key: 'render',
		value: function render(context) {
			// @INSERTPOINT :: @ref: js-init-v3

		}
	}]);

	return Core;
}();

document.addEventListener("DOMContentLoaded", function () {
	var core = new Core();

	/**
  * Render modules
  */
	core.preRender();
	core.render(document);

	/**
  * Initialize modules which are loaded after initial load
  * via custom event 'DOMchanged'
  */
	_app2.default.Vent.on(_app2.default.EVENTS.DOMchanged, function (context) {
		console.log('Dom has changed. Initialising new modules in: ', context);
		core.preRender();
		core.render(context);
	});
});

},{"./app":1,"./utils/helpers":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Const for events (pub/sub)
 *
 * @author: Sebastian Fitzner
 */

/**
 * Events Global
 */

var EVENTS = {
  DOMchanged: 'DOMchanged',
  DOMredirect: 'dom:redirect',
  mediachange: 'mediachange',
  resize: 'resize',
  scroll: 'scroll'
};

// @INSERTPOINT :: @ref: js-events

exports.default = EVENTS;

},{}],4:[function(require,module,exports){
/**
 * Represents a Helper Object.
 * @module Helper
 *
 * @author Sebastian Fitzner
 */

"use strict";

/**
 * @alias module:Helper
 */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Helpers = {};

// ----------------------------------
// MODULE HELPERS
// ----------------------------------

/**
 * Save/Update DOM references for JS Modules
 *
 *
 */
Helpers.saveDOM = function () {
	Helpers.dataJsModules = Helpers.querySelectorArray('[data-js-module]');
};

/**
 * Initialize a module and render it and/or provide a callback function
 *
 * @param {Object} obj - Definition of our module
 * @param {string} obj.el - Required: element
 * @param {Object} obj.Module - Required: class which will be used to render your module
 * @param {boolean} [obj.render=true] - Optional: render the class, if false the class will only be initialized
 * @param {function} [obj.cb] - Optional: provide a function which will be executed after initialisation
 * @param {Object} [obj.context] - Optional: context of module
 *
 */
Helpers.loadModule = function (obj) {
	if (!obj.domName) throw new Error('In order to work with loadModule you need to define the module name (defined in data-js-module attribute) as string! ');
	if (!obj.module) throw new Error('In order to work with loadModule you need to define a Module!');

	var context = obj.context || document.querySelector('html');
	var renderOnInit = obj.render !== false;

	Helpers.forEach(Helpers.dataJsModules, function (i, el) {
		var dataModules = el.getAttribute('data-js-module').split(' ');

		if (dataModules.indexOf(obj.domName) != -1 && Helpers.checkElementInContext(el, context)) {
			var attrs = el.getAttribute('data-js-options');
			var options = JSON.parse(attrs);
			var module = new obj.module({
				el: el,
				options: options
			});

			// Render after initial module loading
			if (renderOnInit) module.render();
			// Provide callback function in which you can use module and options
			if (obj.cb && typeof obj.cb === "function") obj.cb(module, options);
		}
	});
};

// ----------------------------------
// EXTENDING HELPERS
// ----------------------------------

/**
 * Simple extend method to extend the properties of an object.
 *
 * @param {Object} obj - object which will be extended
 *
 * @return {Object} obj - extended object
 */
Helpers.extend = function extend(obj) {
	[].slice.call(arguments, 1).forEach(function (item) {
		for (var key in item) {
			obj[key] = item[key];
		}
	});
	return obj;
};

/**
 * Simple extend method, which extends an object.
 *
 * @param {Object} obj - object which will be extended
 *
 * @return {Object} obj - extended object
 */
Helpers.defaults = function defaults(obj) {
	[].slice.call(arguments, 1).forEach(function (item) {
		for (var key in item) {
			if (obj[key] === undefined) obj[key] = item[key];
		}
	});
	return obj;
};

/**
 * Merge method functions.
 *
 * @param {Object} from - Mixin object which will be merged via Helpers.defaults with the methods of our class
 * @param {Array} methods - Array of method names which will be extended.
 */
Helpers.classMixin = function (from) {
	var methods = arguments.length <= 1 || arguments[1] === undefined ? ['initialize', 'render'] : arguments[1];


	var to = this.prototype;

	/** Add those methods which exists on `from` but not on `to` to the latter */
	Helpers.defaults(to, from);

	/** we do the same for events */
	if (to.events) {
		Helpers.defaults(to.events, from.events);
	}

	// Extend to's methods
	methods.forEach(function (method) {
		Helpers.extendMethod(to, from, method);
	});
};

/**
 * Helper method to extend an already existing method.
 *
 * @param {Object} to - view which will be extended
 * @param {Object} from - methods which comes from mixin
 * @param {string} methodName - function name
 */
Helpers.extendMethod = function (to, from, methodName) {
	function isUndefined(value) {
		return typeof value == 'undefined';
	}

	// if the method is defined on from ...
	if (!isUndefined(from[methodName])) {
		(function () {
			var old = to[methodName];

			// ... we create a new function on to
			to[methodName] = function () {

				// wherein we first call the method which exists on `to`
				var oldReturn = old.apply(this, arguments);

				// and then call the method on `from`
				from[methodName].apply(this, arguments);

				// and then return the expected result,
				// i.e. what the method on `to` returns
				return oldReturn;
			};
		})();
	}
};

// ----------------------------------
// FUNCTIONAL HELPERS
// ----------------------------------

/**
 * Get dom elements in an array
 *
 * @param {String} elem - Required: selector
 * @param {Object} [context] - Optional: context
 *
 * @return {Array}
 */
Helpers.querySelectorArray = Helpers.$ = function (elem, context) {
	if (!elem) throw new Error('In order to work with querySelectorArray you need to define an element as string!');
	var el = elem;
	var customContext = context || document;

	return Array.prototype.slice.call(customContext.querySelectorAll(el));
};

/**
 * Simple forEach method
 *
 * @param {Array} array - array of objects
 * @param {function} callback - callback function
 * @param {string} scope - scope of function
 */
Helpers.forEach = function (array, callback, scope) {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]);
	}
};

/**
 * Find index of a specific item in an array.
 *
 * @param {Array} array - array in which we search for
 * @param {Object} item - item which will be searched
 */
Helpers.indexOf = function (array, item) {
	if (array == null) return -1;
	var l = void 0;
	var i = void 0;

	for (i = 0, l = array.length; i < l; i++) {
		if (array[i] === item) return i;
	}return -1;
};

/**
 * Return new RegExp
 *
 * @param {string} regEx - Regular Expression
 *
 * @return {RegExp}
 */
Helpers.regExp = function (regEx) {
	return new RegExp("(^|\\s+)" + regEx + "(\\s+|$)");
};

/**
 * Throttle method for resize events and more
 *
 * @param {function} func - Function which will be executed.
 * @param {number} wait - number to wait in milliseconds.
 * @param {boolean} immediate - execute function immediately.
 */

Helpers.throttle = function (func, wait, immediate) {
	var timeout = void 0;

	return function () {
		var context = this;
		var args = arguments;
		var callNow = immediate && !timeout;
		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
	};
};

// ----------------------------------
// DETECTION HELPERS
// ----------------------------------

/**
 * Touch Detection
 */
Helpers.isTouch = function () {
	return 'ontouchstart' in window;
};

/**
 * Detect transitionend event.
 */
Helpers.transitionEndEvent = function () {
	var t = void 0;
	var el = document.createElement('fakeelement');
	var transitions = {
		'transition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'MozTransition': 'transitionend',
		'WebkitTransition': 'webkitTransitionEnd'
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}
};

/**
 * Detect animationend event.
 */
Helpers.animationEndEvent = function () {
	var t = void 0;
	var el = document.createElement('fakeelement');
	var animations = {
		'animation': 'animationend',
		'OAnimation': 'oAnimationEnd',
		'MozAnimation': 'animationend',
		'WebkitAnimation': 'webkitAnimationEnd'
	};

	for (t in animations) {
		if (el.style[t] !== undefined) {
			return animations[t];
		}
	}
};

/**
 * Request animation frame
 *
 * @return {function}
 */
Helpers.requestAniFrame = function () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
};

// ----------------------------------
// CHECK HELPERS
// ----------------------------------

/**
 * based on https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
 *
 * Todo: merge with checkElementInContext
 * @return {boolean}
 */
Helpers.hasParent = function (e, p) {
	if (!e) return false;
	var el = e.target || e.srcElement || e || false;
	while (el && el != p) {
		el = el.parentNode || false;
	}
	return el !== false;
};

/**
 * Check if element is in a specific context
 * and return state as boolean
 *
 * Todo: merge with hasParent
 * @param {Object} elem - Element, which will be checked
 * @param {Object} context - Context element, in which our element could persists
 *
 * @return {boolean}
 */
Helpers.checkElementInContext = function (elem, context) {
	var currentNode = elem;
	var contextNode = context || context;

	while (currentNode.parentNode) {
		currentNode = currentNode.parentNode;

		if (Helpers.checkNodeEquality(currentNode, contextNode)) {
			return true;
		}
	}

	return false;
};

/**
 * Check if node is really the same
 *
 * @param {Object} obj1 - Object, which we want to check
 * @param {Object} obj2 - Element, which we want to check against equality
 *
 * @return {boolean}
 */
Helpers.checkNodeEquality = function (obj1, obj2) {
	return obj1 === obj2;
};

/**
 * Check if element is in viewport
 *
 * @param {Object} elem - Object, which we want to check
 * @param {boolean} useBounds - if true, whole element must be visible
 *
 * @return {boolean}
 */
Helpers.isInViewport = function (elem, useBounds) {
	var el = elem;
	var top = el.offsetTop;
	var left = el.offsetLeft;
	var width = el.offsetWidth;
	var height = el.offsetHeight;
	var cond = false;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}

	if (useBounds) {
		cond = top >= window.pageYOffset && left >= window.pageXOffset && top + height <= window.pageYOffset + window.innerHeight && left + width <= window.pageXOffset + window.innerWidth;
	} else {
		cond = top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset;
	}

	return cond;
};

// ----------------------------------
// LAYOUT HELPERS
// ----------------------------------

/**
 * Calculates the outer height for the given DOM element, including the
 * contributions of margin.
 *
 * @param {Object} elem - the element of which to calculate the outer height
 * @param {boolean} outer - add padding to height calculation
 *
 * @return {number}
 */
Helpers.getOuterHeight = function (elem, outer) {
	var el = elem;
	var height = el.offsetHeight;

	if (outer) {
		var style = getComputedStyle(el);
		height += parseInt(style.paddingTop) + parseInt(style.paddingBottom);
	}
	return height;
};

/**
 * Templatizer cleans up template tags and insert the inner html before the tag
 *
 * @param {Object} obj - Contains all properties
 * @param {string} obj.templateName - Defines the template name which is a selector from the element
 */
Helpers.templatizer = function (obj) {
	if (!'content' in document.createElement('template')) return;
	if (!obj && !obj.templateName) throw new Error('You need to pass a template namespace as string!');

	Helpers.querySelectorArray(obj.templateName).forEach(function (tpl) {
		var parent = tpl.parentNode;
		var content = tpl.content.children[0];

		parent.insertBefore(content, tpl);
	});
};

// ----------------------------------
// OTHER HELPERS
// ----------------------------------

/**
 * Determine click handler.
 *
 * @return {string}
 */
Helpers.clickHandler = function () {
	return Helpers.isTouch() ? 'touchstart' : 'click';
};

/**
 * Check if script is already added,
 * and returns true or false
 *
 * @param {string} url - URL to your script
 *
 * @return {boolean}
 */
Helpers.checkScript = function (url) {
	var x = document.getElementsByTagName("script");
	var scriptAdded = false;

	for (var i = 0; i < x.length; i++) {
		if (x[i].src == url) {
			scriptAdded = true;
		}
	}
	return scriptAdded;
};

/**
 * Load scripts asynchronous,
 * check if script is already added,
 * optional check if script is fully loaded and
 * execute callback function.
 *
 * @param {string} url - URL to your script
 * @param {function} callbackFn - callback function
 * @param {Object} callbackObj - this context
 */
Helpers.loadScript = function (url, callbackFn, callbackObj) {
	var scriptAdded = Helpers.checkScript(url);
	var script = void 0;

	if (scriptAdded === false) {
		script = document.createElement("script");
		script.src = url;
		document.body.appendChild(script);
	}

	if (callbackFn && typeof callbackFn === "function") {
		if (scriptAdded === true) {
			callbackFn.apply(callbackObj);
		} else {
			script.onreadystatechange = function () {
				if (x.readyState == 'complete') {
					callbackFn.apply(callbackObj);
				}
			};
			script.onload = function () {
				callbackFn.apply(callbackObj);
			};
		}
	}

	return false;
};

Helpers.hasClass = function (elem, className) {
	var el = elem;

	if ('classList' in document.documentElement) {
		return el.classList.contains(className);
	} else {
		return Helpers.regExp(className).test(el.className);
	}
};

Helpers.addClass = function (elem, className) {
	var el = elem;

	if ('classList' in document.documentElement) {
		el.classList.add(className);
	} else {
		if (!Helpers.hasClass(el, className)) {
			el.className = el.className + ' ' + className;
		}
	}
};

Helpers.removeClass = function (elem, className) {
	var el = elem;

	if ('classList' in document.documentElement) {
		el.classList.remove(className);
	} else {
		el.className = el.className.replace(Helpers.regExp(className), ' ');
	}
};

/**
 * Add/Update a parameter for given url
 *
 * @deprecated use Helpers.updateUrl instead
 * @param {String} url - url on which the parameter should be added / updated
 * @param {String} paramName - parameter name
 * @param {(String|Number)} paramValue - parameter value
 *
 * @return {String} - url
 */
Helpers.addParamToUrl = function (url, paramName, paramValue) {
	var params = {};

	params[paramName] = paramValue;

	return Helpers.updateUrl(url, params);
};

/**
 * Add/Update multiple parameters for given url
 *
 * @param {String} url - url on which parameters should be added / updated
 * @param {Object} params - parameters (name/value)
 *
 * @return {String} - resulting url
 */
Helpers.updateUrl = function (url, params) {
	var urlParts = url.split('?');
	var tmpParams = [];
	var originalParams = [];
	var newParams = [];
	var baseUrl = '';
	var property = '';
	var updated = false;
	var i = 0;
	var j = 0;

	for (property in params) {
		if (params.hasOwnProperty(property)) {
			tmpParams.push([property, '=', params[property]].join(''));
		}
	}

	baseUrl = urlParts[0];
	originalParams = urlParts.length > 1 ? urlParts[1].split('&') : [];

	for (i; i < tmpParams.length; i++) {
		updated = false;

		for (j = 0; j < originalParams.length; j++) {
			if (tmpParams[i] && originalParams[j].split('=')[0] === tmpParams[i].split('=')[0]) {
				originalParams[j] = tmpParams[i];
				updated = true;
				break;
			}
		}

		if (!updated) {
			newParams.push(tmpParams[i]);
		}
	}

	return [baseUrl, '?', originalParams.concat(newParams).join('&')].join('');
};

/**
 * Generates alphanumeric id.
 *
 * @param {Number} [length=5] - length of generated id.
 *
 * @return {String} - generated id
 */
Helpers.makeId = function (length) {
	var idLength = length || 5;
	var charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var i = 0;
	var id = '';

	for (; i < idLength; i++) {
		id += charPool.charAt(Math.floor(Math.random() * charPool.length));
	}return id;
};

exports.default = Helpers;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXNvdXJjZXNcXGpzXFxhcHAuanMiLCJyZXNvdXJjZXNcXGpzXFxtYWluLmpzIiwicmVzb3VyY2VzXFxqc1xcdXRpbHNcXGV2ZW50cy5qcyIsInJlc291cmNlc1xcanNcXHV0aWxzXFxoZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxJQUFJLFFBQVEsUUFBUixDQUFWO0FBQ0EsSUFBTSxjQUFjLFFBQVEsYUFBUixDQUFwQjs7QUFFQSxRQUFRLFdBQVI7O2tCQUVnQixZQUFZO0FBQzNCOzs7Ozs7OztBQU9BLEtBQUksT0FBTyxNQUFYO0FBQ0EsTUFBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsTUFBSyxRQUFMLENBQWMsQ0FBZCxHQUFrQixDQUFsQjs7O0FBR0EsS0FBSSxNQUFNLEtBQUssR0FBTCxHQUFXLGtCQUFRLE1BQVIsQ0FBZSxPQUFPLEdBQVAsSUFBYyxFQUE3QixFQUFpQztBQUNyRCxRQUFNLGtCQUFRLE1BQVIsQ0FBZSxFQUFmLEVBQW1CLFlBQVksTUFBL0I7QUFEK0MsRUFBakMsQ0FBckI7OztBQUtBLEtBQUksV0FBSixHQUFrQixXQUFsQjtBQUNBLEtBQUksQ0FBSixHQUFRLENBQVI7QUFDQSxLQUFJLE1BQUo7Ozs7Ozs7QUFPQSxLQUFJLGFBQUosR0FBb0IsVUFBVSxPQUFWLEVBQW1CO0FBQ3RDLGNBQVksSUFBWixDQUFpQixJQUFqQixDQUFzQixJQUF0QixFQUE0QixPQUE1QjtBQUNBLEVBRkQ7QUFHQSxLQUFJLGNBQUosR0FBcUIsVUFBVSxPQUFWLEVBQW1CO0FBQ3ZDLGNBQVksS0FBWixDQUFrQixJQUFsQixDQUF1QixJQUF2QixFQUE2QixPQUE3QjtBQUNBLEVBRkQ7QUFHQSxLQUFJLG1CQUFKLEdBQTBCLFVBQVUsT0FBVixFQUFtQjtBQUM1QyxjQUFZLFVBQVosQ0FBdUIsSUFB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LEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsU0FBUyxNQUFwQyxDQUFoQixDQUFOO0FBREQsRUFHQSxPQUFPLEVBQVA7QUFDQSxDQVZEOztrQkFZZSxPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBIZWxwZXJzIGZyb20gJy4vdXRpbHMvaGVscGVycyc7XHJcbmltcG9ydCBFVkVOVFMgZnJvbSAnLi91dGlscy9ldmVudHMnO1xyXG5cclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5jb25zdCBFeG9za2VsZXRvbiA9IHJlcXVpcmUoJ2V4b3NrZWxldG9uJyk7XHJcblxyXG5yZXF1aXJlKCdyZXNwaW1hZ2UnKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly8gR0xPQkFMIE5BTUVTUEFDRVxyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Ly8gU2F2ZSBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdFxyXG5cdGxldCByb290ID0gd2luZG93O1xyXG5cdHJvb3QuQmFja2JvbmUgPSB7fTtcclxuXHRyb290LkJhY2tib25lLiQgPSAkO1xyXG5cclxuXHQvLyBAYm9ycm93IG9iamVjdHNcclxuXHRsZXQgQXBwID0gcm9vdC5BcHAgPSBIZWxwZXJzLmV4dGVuZCh3aW5kb3cuQXBwIHx8IHt9LCB7XHJcblx0XHRWZW50OiBIZWxwZXJzLmV4dGVuZCh7fSwgRXhvc2tlbGV0b24uRXZlbnRzKVxyXG5cdH0pO1xyXG5cclxuXHQvLyBBZGQgZ2xvYmFsc1xyXG5cdEFwcC5FeG9za2VsZXRvbiA9IEV4b3NrZWxldG9uO1xyXG5cdEFwcC4kID0gJDtcclxuXHRBcHAuRVZFTlRTID0gRVZFTlRTO1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgY3VzdG9tIHZpZXcgd2l0aCBvd24gcHJvcGVydGllcyBhbmRcclxuXHQgKiB0YWtlIHRoaXMgdmlldyBpbiBvdXIgbW9kdWxlc1xyXG5cdCAqIHJlZ2lzdGVyIG9ubHkgb25lIHJlZmVyZW5jZSB0byBvdXIgZ2xvYmFsIGxpYnJhcnkgRXhvc2tlbGV0b25cclxuXHQgKi9cclxuXHRBcHAuQ29tcG9uZW50VmlldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0XHRFeG9za2VsZXRvbi5WaWV3LmNhbGwodGhpcywgb3B0aW9ucyk7XHJcblx0fTtcclxuXHRBcHAuQ29tcG9uZW50TW9kZWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdFx0RXhvc2tlbGV0b24uTW9kZWwuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxuXHR9O1xyXG5cdEFwcC5Db21wb25lbnRDb2xsZWN0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRcdEV4b3NrZWxldG9uLkNvbGxlY3Rpb24uY2FsbCh0aGlzLCBvcHRpb25zKTtcclxuXHR9O1xyXG5cclxuXHRIZWxwZXJzLmV4dGVuZChBcHAuQ29tcG9uZW50Vmlldy5wcm90b3R5cGUsIEV4b3NrZWxldG9uLlZpZXcucHJvdG90eXBlLCB7fSk7XHJcblx0SGVscGVycy5leHRlbmQoQXBwLkNvbXBvbmVudE1vZGVsLnByb3RvdHlwZSwgRXhvc2tlbGV0b24uTW9kZWwucHJvdG90eXBlLCB7fSk7XHJcblx0SGVscGVycy5leHRlbmQoQXBwLkNvbXBvbmVudENvbGxlY3Rpb24ucHJvdG90eXBlLCBFeG9za2VsZXRvbi5Db2xsZWN0aW9uLnByb3RvdHlwZSwge30pO1xyXG5cclxuXHRBcHAuQ29tcG9uZW50Vmlldy5leHRlbmQgPSBFeG9za2VsZXRvbi5WaWV3LmV4dGVuZDtcclxuXHRBcHAuQ29tcG9uZW50TW9kZWwuZXh0ZW5kID0gRXhvc2tlbGV0b24uTW9kZWwuZXh0ZW5kO1xyXG5cdEFwcC5Db21wb25lbnRDb2xsZWN0aW9uLmV4dGVuZCA9IEV4b3NrZWxldG9uLkNvbGxlY3Rpb24uZXh0ZW5kO1xyXG5cclxuXHQvKipcclxuXHQgKiBBZGQgb3VyIE1peGluIHRvIG91ciBWaWV3IG9iamVjdC5cclxuXHQgKi9cclxuXHRBcHAuQ29tcG9uZW50Vmlldy5jbGFzc01peGluID0gSGVscGVycy5jbGFzc01peGluO1xyXG5cclxuXHQvLyBGZWF0dXJlIGRldGVjdGlvblxyXG5cdEFwcC5zdXBwb3J0ID0gQXBwLnN1cHBvcnQgfHwge307XHJcblx0QXBwLnN1cHBvcnQudG91Y2ggPSBIZWxwZXJzLmlzVG91Y2goKTtcclxuXHRBcHAuY2xpY2tIYW5kbGVyID0gSGVscGVycy5jbGlja0hhbmRsZXIoKTtcclxuXHJcblx0Ly8gVmVyc2lvbmluZ1xyXG5cdEFwcC52ZXJzaW9uID0gXCIwLjAuMVwiO1xyXG5cclxuXHQvLyBNZWRpYSBRdWVyeVxyXG5cdGxldCBoZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaGVhZCcpO1xyXG5cdEFwcC5jdXJyZW50TWVkaWEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShoZWFkWzBdLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LWZhbWlseScpO1xyXG5cclxuXHQvLyBTY3JlZW4gU2l6ZVxyXG5cdEFwcC5zY3JlZW5TaXplID0ge1xyXG5cdFx0d2lkdGg6IHJvb3QuaW5uZXJXaWR0aCxcclxuXHRcdGhlaWdodDogcm9vdC5pbm5lckhlaWdodFxyXG5cdH07XHJcblxyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBDSEVDS0lOR1xyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Ly8gZGlzYWJsZSBkZXZtb2RlIGxvZ2dpbmcgaWYgbm90IG9uIGllOSBhbmQgcGFyYW1ldGVyIFwiZGV2bW9kZVwiIG5vdCBwcmVzZW50XHJcblx0aWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2h0bWwnKVswXS5jbGFzc05hbWUuaW5kZXhPZignaWU5JykgPCAwKSB7XHJcblx0XHRpZiAoZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoLmluZGV4T2YoJ2Rldm1vZGUnKSA8IDApIHtcclxuXHRcdFx0Ly8gaGlkZSBhbGwgd2FybmluZ3MgYW5kIGxvZ3MgaWYgbm90IGluIGRldm1vZGVcclxuXHRcdFx0Y29uc29sZS5sb2cgPSBjb25zb2xlLndhcm4gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdH07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRBcHAuZGV2bW9kZSA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0Ly8gSUU5IEZJWDogaW4gaWU5IHdpbmRvdy5jb25zb2xlIHNlZW1zIHRvIGJlIHVuZGVmaW5lZCB1bnRpbCB5b3Ugb3BlbiBkZXYgdG9vbHNcclxuXHRcdGlmICghd2luZG93LmNvbnNvbGUpIHtcclxuXHRcdFx0d2luZG93LmNvbnNvbGUgPSB7fTtcclxuXHRcdFx0Y29uc29sZS5sb2cgPSBjb25zb2xlLndhcm4gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ly8gR0xPQkFMIEVWRU5UU1xyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0LyoqXHJcblx0ICogVHJpZ2dlcnNcclxuXHQgKi9cclxuXHJcblx0Ly8gVHJpZ2dlciBnbG9iYWwgcmVzaXplIGV2ZW50XHJcblx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBjdXJyZW50TWVkaWEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShoZWFkWzBdLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LWZhbWlseScpO1xyXG5cdFx0bGV0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG5cdFx0aWYgKGN1cnJlbnRNZWRpYSAhPT0gQXBwLmN1cnJlbnRNZWRpYSkge1xyXG5cdFx0XHRsZXQgb2xkTWVkaWEgPSBBcHAuY3VycmVudE1lZGlhO1xyXG5cclxuXHRcdFx0QXBwLmN1cnJlbnRNZWRpYSA9IGN1cnJlbnRNZWRpYTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0FwcC5jdXJyZW50TWVkaWE6ICcsIEFwcC5jdXJyZW50TWVkaWEpO1xyXG5cclxuXHRcdFx0QXBwLlZlbnQudHJpZ2dlcihBcHAuRVZFTlRTLm1lZGlhY2hhbmdlLCB7XHJcblx0XHRcdFx0dHlwZTogQXBwLkVWRU5UUy5tZWRpYWNoYW5nZSxcclxuXHRcdFx0XHRjdXJyZW50TWVkaWE6IGN1cnJlbnRNZWRpYSxcclxuXHRcdFx0XHRvbGRNZWRpYTogb2xkTWVkaWFcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHdpZHRoICE9IEFwcC5zY3JlZW5TaXplLndpZHRoKSB7XHJcblx0XHRcdEFwcC5zY3JlZW5TaXplLndpZHRoID0gd2lkdGg7XHJcblx0XHRcdEFwcC5WZW50LnRyaWdnZXIoQXBwLkVWRU5UUy5yZXNpemUsIGUpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdGRvY3VtZW50Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdEFwcC5WZW50LnRyaWdnZXIoQXBwLkVWRU5UUy5zY3JvbGwsIGUpO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiBBcHA7XHJcblxyXG59KS5jYWxsKHRoaXMpOyIsIi8vIE1haW4gUmVxdWlyZW1lbnRzXHJcbmltcG9ydCBBcHAgZnJvbSAnLi9hcHAnO1xyXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL3V0aWxzL2hlbHBlcnMnO1xyXG5cclxuLy8gRVM2IE1vZHVsZXNcclxuXHJcbi8vIEBJTlNFUlRQT0lOVCA6OiBAcmVmOiBqcy1pbXBvcnRcclxuXHJcbi8vIFZhcnNcclxuY29uc3QgJCA9IEFwcC4kO1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gTWFpbiBGdW5jdGlvbmFsaXR5XHJcbmNsYXNzIENvcmUge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXplIG91ciBjb3JlIGZ1bmN0aW9uYWxpdHlcclxuXHQgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgb25seSBiZSBleGVjdXRlZCBvbmNlLlxyXG5cdCAqL1xyXG5cdGluaXRpYWxpemUoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnQXBwIGluaXRpYWxpemVkIHdpdGggdmVyc2lvbjogJywgQXBwLnZlcnNpb24pO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGV0ZWN0IFRvdWNoXHJcblx0XHQgKi9cclxuXHRcdGlmICghQXBwLnN1cHBvcnQudG91Y2gpIHtcclxuXHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCduby10b3VjaCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCd0b3VjaCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlZGlyZWN0XHJcblx0XHRBcHAuVmVudC5vbihBcHAuRVZFTlRTLkRPTXJlZGlyZWN0LCAob2JqKSA9PiB7XHJcblx0XHRcdGlmICghb2JqICYmICFvYmoudXJsKSB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdCBpcyBub3QgZGVmaW5lZC4gUGxlYXNlIHByb3ZpZGUgYW4gdXJsIGluIHlvdXIgb2JqZWN0IScpO1xyXG5cclxuXHRcdFx0Ly8gUmVkaXJlY3QgdG8gcGFnZVxyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IFN0cmluZyhvYmoudXJsKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEBJTlNFUlRQT0lOVCA6OiBAcmVmOiBqcy1pbml0LW9uY2UtdjNcclxuXHJcblx0fVxyXG5cclxuXHRwcmVSZW5kZXIoKSB7XHJcblx0XHRIZWxwZXJzLnNhdmVET00oKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcihjb250ZXh0KSB7XHJcblx0XHQvLyBASU5TRVJUUE9JTlQgOjogQHJlZjoganMtaW5pdC12M1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuXHRsZXQgY29yZSA9IG5ldyBDb3JlKCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlbmRlciBtb2R1bGVzXHJcblx0ICovXHJcblx0Y29yZS5wcmVSZW5kZXIoKTtcclxuXHRjb3JlLnJlbmRlcihkb2N1bWVudCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemUgbW9kdWxlcyB3aGljaCBhcmUgbG9hZGVkIGFmdGVyIGluaXRpYWwgbG9hZFxyXG5cdCAqIHZpYSBjdXN0b20gZXZlbnQgJ0RPTWNoYW5nZWQnXHJcblx0ICovXHJcblx0QXBwLlZlbnQub24oQXBwLkVWRU5UUy5ET01jaGFuZ2VkLCAoY29udGV4dCkgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2coJ0RvbSBoYXMgY2hhbmdlZC4gSW5pdGlhbGlzaW5nIG5ldyBtb2R1bGVzIGluOiAnLCBjb250ZXh0KTtcclxuXHRcdGNvcmUucHJlUmVuZGVyKCk7XHJcblx0XHRjb3JlLnJlbmRlcihjb250ZXh0KTtcclxuXHR9KTtcclxufSk7IiwiLyoqXHJcbiAqIENvbnN0IGZvciBldmVudHMgKHB1Yi9zdWIpXHJcbiAqXHJcbiAqIEBhdXRob3I6IFNlYmFzdGlhbiBGaXR6bmVyXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEV2ZW50cyBHbG9iYWxcclxuICovXHJcblxyXG5jb25zdCBFVkVOVFMgPSB7XHJcblx0RE9NY2hhbmdlZDogJ0RPTWNoYW5nZWQnLFxyXG5cdERPTXJlZGlyZWN0OiAnZG9tOnJlZGlyZWN0JyxcclxuXHRtZWRpYWNoYW5nZTogJ21lZGlhY2hhbmdlJyxcclxuXHRyZXNpemU6ICdyZXNpemUnLFxyXG5cdHNjcm9sbDogJ3Njcm9sbCdcclxufTtcclxuXHJcbi8vIEBJTlNFUlRQT0lOVCA6OiBAcmVmOiBqcy1ldmVudHNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVWRU5UUztcclxuIiwiLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBIZWxwZXIgT2JqZWN0LlxyXG4gKiBAbW9kdWxlIEhlbHBlclxyXG4gKlxyXG4gKiBAYXV0aG9yIFNlYmFzdGlhbiBGaXR6bmVyXHJcbiAqL1xyXG5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogQGFsaWFzIG1vZHVsZTpIZWxwZXJcclxuICovXHJcbmxldCBIZWxwZXJzID0ge307XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIE1PRFVMRSBIRUxQRVJTXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8qKlxyXG4gKiBTYXZlL1VwZGF0ZSBET00gcmVmZXJlbmNlcyBmb3IgSlMgTW9kdWxlc1xyXG4gKlxyXG4gKlxyXG4gKi9cclxuSGVscGVycy5zYXZlRE9NID0gZnVuY3Rpb24oKSB7XHJcblx0SGVscGVycy5kYXRhSnNNb2R1bGVzID0gSGVscGVycy5xdWVyeVNlbGVjdG9yQXJyYXkoJ1tkYXRhLWpzLW1vZHVsZV0nKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGEgbW9kdWxlIGFuZCByZW5kZXIgaXQgYW5kL29yIHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gRGVmaW5pdGlvbiBvZiBvdXIgbW9kdWxlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouZWwgLSBSZXF1aXJlZDogZWxlbWVudFxyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqLk1vZHVsZSAtIFJlcXVpcmVkOiBjbGFzcyB3aGljaCB3aWxsIGJlIHVzZWQgdG8gcmVuZGVyIHlvdXIgbW9kdWxlXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29iai5yZW5kZXI9dHJ1ZV0gLSBPcHRpb25hbDogcmVuZGVyIHRoZSBjbGFzcywgaWYgZmFsc2UgdGhlIGNsYXNzIHdpbGwgb25seSBiZSBpbml0aWFsaXplZFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb2JqLmNiXSAtIE9wdGlvbmFsOiBwcm92aWRlIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBleGVjdXRlZCBhZnRlciBpbml0aWFsaXNhdGlvblxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29iai5jb250ZXh0XSAtIE9wdGlvbmFsOiBjb250ZXh0IG9mIG1vZHVsZVxyXG4gKlxyXG4gKi9cclxuSGVscGVycy5sb2FkTW9kdWxlID0gZnVuY3Rpb24ob2JqKSB7XHJcblx0aWYgKCFvYmouZG9tTmFtZSkgdGhyb3cgbmV3IEVycm9yKCdJbiBvcmRlciB0byB3b3JrIHdpdGggbG9hZE1vZHVsZSB5b3UgbmVlZCB0byBkZWZpbmUgdGhlIG1vZHVsZSBuYW1lIChkZWZpbmVkIGluIGRhdGEtanMtbW9kdWxlIGF0dHJpYnV0ZSkgYXMgc3RyaW5nISAnKTtcclxuXHRpZiAoIW9iai5tb2R1bGUpIHRocm93IG5ldyBFcnJvcignSW4gb3JkZXIgdG8gd29yayB3aXRoIGxvYWRNb2R1bGUgeW91IG5lZWQgdG8gZGVmaW5lIGEgTW9kdWxlIScpO1xyXG5cclxuXHRsZXQgY29udGV4dCA9IG9iai5jb250ZXh0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcclxuXHRsZXQgcmVuZGVyT25Jbml0ID0gb2JqLnJlbmRlciAhPT0gZmFsc2U7XHJcblxyXG5cclxuXHRIZWxwZXJzLmZvckVhY2goSGVscGVycy5kYXRhSnNNb2R1bGVzLCAoaSwgZWwpID0+IHtcclxuXHRcdGxldCBkYXRhTW9kdWxlcyA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1qcy1tb2R1bGUnKS5zcGxpdCgnICcpO1xyXG5cclxuXHRcdGlmIChkYXRhTW9kdWxlcy5pbmRleE9mKG9iai5kb21OYW1lKSAhPSAtMSAmJiBIZWxwZXJzLmNoZWNrRWxlbWVudEluQ29udGV4dChlbCwgY29udGV4dCkpIHtcclxuXHRcdFx0bGV0IGF0dHJzID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWpzLW9wdGlvbnMnKTtcclxuXHRcdFx0bGV0IG9wdGlvbnMgPSBKU09OLnBhcnNlKGF0dHJzKTtcclxuXHRcdFx0bGV0IG1vZHVsZSA9IG5ldyBvYmoubW9kdWxlKHtcclxuXHRcdFx0XHRlbDogZWwsXHJcblx0XHRcdFx0b3B0aW9uczogb3B0aW9uc1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIFJlbmRlciBhZnRlciBpbml0aWFsIG1vZHVsZSBsb2FkaW5nXHJcblx0XHRcdGlmIChyZW5kZXJPbkluaXQpIG1vZHVsZS5yZW5kZXIoKTtcclxuXHRcdFx0Ly8gUHJvdmlkZSBjYWxsYmFjayBmdW5jdGlvbiBpbiB3aGljaCB5b3UgY2FuIHVzZSBtb2R1bGUgYW5kIG9wdGlvbnNcclxuXHRcdFx0aWYgKG9iai5jYiAmJiB0eXBlb2Yob2JqLmNiKSA9PT0gXCJmdW5jdGlvblwiKSBvYmouY2IobW9kdWxlLCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gRVhURU5ESU5HIEhFTFBFUlNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyoqXHJcbiAqIFNpbXBsZSBleHRlbmQgbWV0aG9kIHRvIGV4dGVuZCB0aGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBvYmplY3Qgd2hpY2ggd2lsbCBiZSBleHRlbmRlZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9iaiAtIGV4dGVuZGVkIG9iamVjdFxyXG4gKi9cclxuSGVscGVycy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmQob2JqKSB7XHJcblx0W10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdGZvciAobGV0IGtleSBpbiBpdGVtKSBvYmpba2V5XSA9IGl0ZW1ba2V5XTtcclxuXHR9KTtcclxuXHRyZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNpbXBsZSBleHRlbmQgbWV0aG9kLCB3aGljaCBleHRlbmRzIGFuIG9iamVjdC5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIG9iamVjdCB3aGljaCB3aWxsIGJlIGV4dGVuZGVkXHJcbiAqXHJcbiAqIEByZXR1cm4ge09iamVjdH0gb2JqIC0gZXh0ZW5kZWQgb2JqZWN0XHJcbiAqL1xyXG5IZWxwZXJzLmRlZmF1bHRzID0gZnVuY3Rpb24gZGVmYXVsdHMob2JqKSB7XHJcblx0W10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdGZvciAobGV0IGtleSBpbiBpdGVtKSB7XHJcblx0XHRcdGlmIChvYmpba2V5XSA9PT0gdW5kZWZpbmVkKSBvYmpba2V5XSA9IGl0ZW1ba2V5XTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRyZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1lcmdlIG1ldGhvZCBmdW5jdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tIC0gTWl4aW4gb2JqZWN0IHdoaWNoIHdpbGwgYmUgbWVyZ2VkIHZpYSBIZWxwZXJzLmRlZmF1bHRzIHdpdGggdGhlIG1ldGhvZHMgb2Ygb3VyIGNsYXNzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IG1ldGhvZHMgLSBBcnJheSBvZiBtZXRob2QgbmFtZXMgd2hpY2ggd2lsbCBiZSBleHRlbmRlZC5cclxuICovXHJcbkhlbHBlcnMuY2xhc3NNaXhpbiA9IGZ1bmN0aW9uKGZyb20sIG1ldGhvZHMgPSBbJ2luaXRpYWxpemUnLCAncmVuZGVyJ10pIHtcclxuXHJcblx0bGV0IHRvID0gdGhpcy5wcm90b3R5cGU7XHJcblxyXG5cdC8qKiBBZGQgdGhvc2UgbWV0aG9kcyB3aGljaCBleGlzdHMgb24gYGZyb21gIGJ1dCBub3Qgb24gYHRvYCB0byB0aGUgbGF0dGVyICovXHJcblx0SGVscGVycy5kZWZhdWx0cyh0bywgZnJvbSk7XHJcblxyXG5cdC8qKiB3ZSBkbyB0aGUgc2FtZSBmb3IgZXZlbnRzICovXHJcblx0aWYgKHRvLmV2ZW50cykge1xyXG5cdFx0SGVscGVycy5kZWZhdWx0cyh0by5ldmVudHMsIGZyb20uZXZlbnRzKTtcclxuXHR9XHJcblxyXG5cdC8vIEV4dGVuZCB0bydzIG1ldGhvZHNcclxuXHRtZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG5cdFx0SGVscGVycy5leHRlbmRNZXRob2QodG8sIGZyb20sIG1ldGhvZCk7XHJcblx0fSk7XHJcbn07XHJcblxyXG4vKipcclxuICogSGVscGVyIG1ldGhvZCB0byBleHRlbmQgYW4gYWxyZWFkeSBleGlzdGluZyBtZXRob2QuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB0byAtIHZpZXcgd2hpY2ggd2lsbCBiZSBleHRlbmRlZFxyXG4gKiBAcGFyYW0ge09iamVjdH0gZnJvbSAtIG1ldGhvZHMgd2hpY2ggY29tZXMgZnJvbSBtaXhpblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSAtIGZ1bmN0aW9uIG5hbWVcclxuICovXHJcbkhlbHBlcnMuZXh0ZW5kTWV0aG9kID0gZnVuY3Rpb24odG8sIGZyb20sIG1ldGhvZE5hbWUpIHtcclxuXHRmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJztcclxuXHR9XHJcblxyXG5cdC8vIGlmIHRoZSBtZXRob2QgaXMgZGVmaW5lZCBvbiBmcm9tIC4uLlxyXG5cdGlmICghaXNVbmRlZmluZWQoZnJvbVttZXRob2ROYW1lXSkpIHtcclxuXHRcdGxldCBvbGQgPSB0b1ttZXRob2ROYW1lXTtcclxuXHJcblx0XHQvLyAuLi4gd2UgY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9uIHRvXHJcblx0XHR0b1ttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0Ly8gd2hlcmVpbiB3ZSBmaXJzdCBjYWxsIHRoZSBtZXRob2Qgd2hpY2ggZXhpc3RzIG9uIGB0b2BcclxuXHRcdFx0bGV0IG9sZFJldHVybiA9IG9sZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuXHRcdFx0Ly8gYW5kIHRoZW4gY2FsbCB0aGUgbWV0aG9kIG9uIGBmcm9tYFxyXG5cdFx0XHRmcm9tW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG5cdFx0XHQvLyBhbmQgdGhlbiByZXR1cm4gdGhlIGV4cGVjdGVkIHJlc3VsdCxcclxuXHRcdFx0Ly8gaS5lLiB3aGF0IHRoZSBtZXRob2Qgb24gYHRvYCByZXR1cm5zXHJcblx0XHRcdHJldHVybiBvbGRSZXR1cm47XHJcblx0XHR9O1xyXG5cdH1cclxufTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gRlVOQ1RJT05BTCBIRUxQRVJTXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8qKlxyXG4gKiBHZXQgZG9tIGVsZW1lbnRzIGluIGFuIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtIC0gUmVxdWlyZWQ6IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gLSBPcHRpb25hbDogY29udGV4dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICovXHJcbkhlbHBlcnMucXVlcnlTZWxlY3RvckFycmF5ID0gSGVscGVycy4kID0gZnVuY3Rpb24oZWxlbSwgY29udGV4dCkge1xyXG5cdGlmICghZWxlbSkgdGhyb3cgbmV3IEVycm9yKCdJbiBvcmRlciB0byB3b3JrIHdpdGggcXVlcnlTZWxlY3RvckFycmF5IHlvdSBuZWVkIHRvIGRlZmluZSBhbiBlbGVtZW50IGFzIHN0cmluZyEnKTtcclxuXHRsZXQgZWwgPSBlbGVtO1xyXG5cdGxldCBjdXN0b21Db250ZXh0ID0gY29udGV4dCB8fCBkb2N1bWVudDtcclxuXHJcblx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKChjdXN0b21Db250ZXh0KS5xdWVyeVNlbGVjdG9yQWxsKGVsKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2ltcGxlIGZvckVhY2ggbWV0aG9kXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IC0gYXJyYXkgb2Ygb2JqZWN0c1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzY29wZSAtIHNjb3BlIG9mIGZ1bmN0aW9uXHJcbiAqL1xyXG5IZWxwZXJzLmZvckVhY2ggPSBmdW5jdGlvbihhcnJheSwgY2FsbGJhY2ssIHNjb3BlKSB7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y2FsbGJhY2suY2FsbChzY29wZSwgaSwgYXJyYXlbaV0pO1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaW5kIGluZGV4IG9mIGEgc3BlY2lmaWMgaXRlbSBpbiBhbiBhcnJheS5cclxuICpcclxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSBhcnJheSBpbiB3aGljaCB3ZSBzZWFyY2ggZm9yXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIC0gaXRlbSB3aGljaCB3aWxsIGJlIHNlYXJjaGVkXHJcbiAqL1xyXG5IZWxwZXJzLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xyXG5cdGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XHJcblx0bGV0IGw7XHJcblx0bGV0IGk7XHJcblxyXG5cdGZvciAoaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspXHJcblx0XHRpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xyXG5cdHJldHVybiAtMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gbmV3IFJlZ0V4cFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnRXggLSBSZWd1bGFyIEV4cHJlc3Npb25cclxuICpcclxuICogQHJldHVybiB7UmVnRXhwfVxyXG4gKi9cclxuSGVscGVycy5yZWdFeHAgPSBmdW5jdGlvbihyZWdFeCkge1xyXG5cdHJldHVybiBuZXcgUmVnRXhwKFwiKF58XFxcXHMrKVwiICsgcmVnRXggKyBcIihcXFxccyt8JClcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhyb3R0bGUgbWV0aG9kIGZvciByZXNpemUgZXZlbnRzIGFuZCBtb3JlXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgLSBGdW5jdGlvbiB3aGljaCB3aWxsIGJlIGV4ZWN1dGVkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gd2FpdCAtIG51bWJlciB0byB3YWl0IGluIG1pbGxpc2Vjb25kcy5cclxuICogQHBhcmFtIHtib29sZWFufSBpbW1lZGlhdGUgLSBleGVjdXRlIGZ1bmN0aW9uIGltbWVkaWF0ZWx5LlxyXG4gKi9cclxuXHJcbkhlbHBlcnMudGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcclxuXHRsZXQgdGltZW91dDtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0bGV0IGNvbnRleHQgPSB0aGlzO1xyXG5cdFx0bGV0IGFyZ3MgPSBhcmd1bWVudHM7XHJcblx0XHRsZXQgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcclxuXHRcdGxldCBsYXRlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aW1lb3V0ID0gbnVsbDtcclxuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuXHJcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XHJcblxyXG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcblx0fTtcclxufTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gREVURUNUSU9OIEhFTFBFUlNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyoqXHJcbiAqIFRvdWNoIERldGVjdGlvblxyXG4gKi9cclxuSGVscGVycy5pc1RvdWNoID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZXRlY3QgdHJhbnNpdGlvbmVuZCBldmVudC5cclxuICovXHJcbkhlbHBlcnMudHJhbnNpdGlvbkVuZEV2ZW50ID0gZnVuY3Rpb24oKSB7XHJcblx0bGV0IHQ7XHJcblx0bGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKTtcclxuXHRsZXQgdHJhbnNpdGlvbnMgPSB7XHJcblx0XHQndHJhbnNpdGlvbic6ICd0cmFuc2l0aW9uZW5kJyxcclxuXHRcdCdPVHJhbnNpdGlvbic6ICdvVHJhbnNpdGlvbkVuZCcsXHJcblx0XHQnTW96VHJhbnNpdGlvbic6ICd0cmFuc2l0aW9uZW5kJyxcclxuXHRcdCdXZWJraXRUcmFuc2l0aW9uJzogJ3dlYmtpdFRyYW5zaXRpb25FbmQnXHJcblx0fTtcclxuXHJcblx0Zm9yICh0IGluIHRyYW5zaXRpb25zKSB7XHJcblx0XHRpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRyZXR1cm4gdHJhbnNpdGlvbnNbdF07XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIERldGVjdCBhbmltYXRpb25lbmQgZXZlbnQuXHJcbiAqL1xyXG5IZWxwZXJzLmFuaW1hdGlvbkVuZEV2ZW50ID0gZnVuY3Rpb24oKSB7XHJcblx0bGV0IHQ7XHJcblx0bGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKTtcclxuXHRsZXQgYW5pbWF0aW9ucyA9IHtcclxuXHRcdCdhbmltYXRpb24nOiAnYW5pbWF0aW9uZW5kJyxcclxuXHRcdCdPQW5pbWF0aW9uJzogJ29BbmltYXRpb25FbmQnLFxyXG5cdFx0J01vekFuaW1hdGlvbic6ICdhbmltYXRpb25lbmQnLFxyXG5cdFx0J1dlYmtpdEFuaW1hdGlvbic6ICd3ZWJraXRBbmltYXRpb25FbmQnXHJcblx0fTtcclxuXHJcblx0Zm9yICh0IGluIGFuaW1hdGlvbnMpIHtcclxuXHRcdGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybiBhbmltYXRpb25zW3RdO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbkhlbHBlcnMucmVxdWVzdEFuaUZyYW1lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG5cdFx0fTtcclxufTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gQ0hFQ0sgSEVMUEVSU1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vKipcclxuICogYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2ludXlha3NhL2pxdWVyeS5uaWNlc2Nyb2xsL2Jsb2IvbWFzdGVyL2pxdWVyeS5uaWNlc2Nyb2xsLmpzXHJcbiAqXHJcbiAqIFRvZG86IG1lcmdlIHdpdGggY2hlY2tFbGVtZW50SW5Db250ZXh0XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5IZWxwZXJzLmhhc1BhcmVudCA9IGZ1bmN0aW9uKGUsIHApIHtcclxuXHRpZiAoIWUpIHJldHVybiBmYWxzZTtcclxuXHRsZXQgZWwgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQgfHwgZSB8fCBmYWxzZTtcclxuXHR3aGlsZSAoZWwgJiYgZWwgIT0gcCkge1xyXG5cdFx0ZWwgPSBlbC5wYXJlbnROb2RlIHx8IGZhbHNlO1xyXG5cdH1cclxuXHRyZXR1cm4gKGVsICE9PSBmYWxzZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZWxlbWVudCBpcyBpbiBhIHNwZWNpZmljIGNvbnRleHRcclxuICogYW5kIHJldHVybiBzdGF0ZSBhcyBib29sZWFuXHJcbiAqXHJcbiAqIFRvZG86IG1lcmdlIHdpdGggaGFzUGFyZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gRWxlbWVudCwgd2hpY2ggd2lsbCBiZSBjaGVja2VkXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gQ29udGV4dCBlbGVtZW50LCBpbiB3aGljaCBvdXIgZWxlbWVudCBjb3VsZCBwZXJzaXN0c1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuSGVscGVycy5jaGVja0VsZW1lbnRJbkNvbnRleHQgPSBmdW5jdGlvbihlbGVtLCBjb250ZXh0KSB7XHJcblx0bGV0IGN1cnJlbnROb2RlID0gZWxlbTtcclxuXHRsZXQgY29udGV4dE5vZGUgPSBjb250ZXh0IHx8IGNvbnRleHQ7XHJcblxyXG5cdHdoaWxlIChjdXJyZW50Tm9kZS5wYXJlbnROb2RlKSB7XHJcblx0XHRjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudE5vZGU7XHJcblxyXG5cdFx0aWYgKEhlbHBlcnMuY2hlY2tOb2RlRXF1YWxpdHkoY3VycmVudE5vZGUsIGNvbnRleHROb2RlKSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBub2RlIGlzIHJlYWxseSB0aGUgc2FtZVxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSAtIE9iamVjdCwgd2hpY2ggd2Ugd2FudCB0byBjaGVja1xyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMiAtIEVsZW1lbnQsIHdoaWNoIHdlIHdhbnQgdG8gY2hlY2sgYWdhaW5zdCBlcXVhbGl0eVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuSGVscGVycy5jaGVja05vZGVFcXVhbGl0eSA9IGZ1bmN0aW9uKG9iajEsIG9iajIpIHtcclxuXHRyZXR1cm4gKG9iajEgPT09IG9iajIpO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBlbGVtZW50IGlzIGluIHZpZXdwb3J0XHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gT2JqZWN0LCB3aGljaCB3ZSB3YW50IHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlQm91bmRzIC0gaWYgdHJ1ZSwgd2hvbGUgZWxlbWVudCBtdXN0IGJlIHZpc2libGVcclxuICpcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbkhlbHBlcnMuaXNJblZpZXdwb3J0ID0gZnVuY3Rpb24oZWxlbSwgdXNlQm91bmRzKSB7XHJcblx0bGV0IGVsID0gZWxlbTtcclxuXHRsZXQgdG9wID0gZWwub2Zmc2V0VG9wO1xyXG5cdGxldCBsZWZ0ID0gZWwub2Zmc2V0TGVmdDtcclxuXHRsZXQgd2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcclxuXHRsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xyXG5cdGxldCBjb25kID0gZmFsc2U7XHJcblxyXG5cdHdoaWxlIChlbC5vZmZzZXRQYXJlbnQpIHtcclxuXHRcdGVsID0gZWwub2Zmc2V0UGFyZW50O1xyXG5cdFx0dG9wICs9IGVsLm9mZnNldFRvcDtcclxuXHRcdGxlZnQgKz0gZWwub2Zmc2V0TGVmdDtcclxuXHR9XHJcblxyXG5cdGlmICh1c2VCb3VuZHMpIHtcclxuXHRcdGNvbmQgPSB0b3AgPj0gd2luZG93LnBhZ2VZT2Zmc2V0ICYmIGxlZnQgPj0gd2luZG93LnBhZ2VYT2Zmc2V0ICYmICh0b3AgKyBoZWlnaHQpIDw9ICh3aW5kb3cucGFnZVlPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQpICYmIChsZWZ0ICsgd2lkdGgpIDw9ICh3aW5kb3cucGFnZVhPZmZzZXQgKyB3aW5kb3cuaW5uZXJXaWR0aCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbmQgPSB0b3AgPCAod2luZG93LnBhZ2VZT2Zmc2V0ICsgd2luZG93LmlubmVySGVpZ2h0KSAmJiBsZWZ0IDwgKHdpbmRvdy5wYWdlWE9mZnNldCArIHdpbmRvdy5pbm5lcldpZHRoKSAmJiAodG9wICsgaGVpZ2h0KSA+IHdpbmRvdy5wYWdlWU9mZnNldCAmJiAobGVmdCArIHdpZHRoKSA+IHdpbmRvdy5wYWdlWE9mZnNldDtcclxuXHR9XHJcblxyXG5cdHJldHVybiBjb25kO1xyXG59O1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBMQVlPVVQgSEVMUEVSU1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB0aGUgb3V0ZXIgaGVpZ2h0IGZvciB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnQsIGluY2x1ZGluZyB0aGVcclxuICogY29udHJpYnV0aW9ucyBvZiBtYXJnaW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gdGhlIGVsZW1lbnQgb2Ygd2hpY2ggdG8gY2FsY3VsYXRlIHRoZSBvdXRlciBoZWlnaHRcclxuICogQHBhcmFtIHtib29sZWFufSBvdXRlciAtIGFkZCBwYWRkaW5nIHRvIGhlaWdodCBjYWxjdWxhdGlvblxyXG4gKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAqL1xyXG5IZWxwZXJzLmdldE91dGVySGVpZ2h0ID0gZnVuY3Rpb24oZWxlbSwgb3V0ZXIpIHtcclxuXHRsZXQgZWwgPSBlbGVtO1xyXG5cdGxldCBoZWlnaHQgPSBlbC5vZmZzZXRIZWlnaHQ7XHJcblxyXG5cdGlmIChvdXRlcikge1xyXG5cdFx0bGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XHJcblx0XHRoZWlnaHQgKz0gcGFyc2VJbnQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUludChzdHlsZS5wYWRkaW5nQm90dG9tKTtcclxuXHR9XHJcblx0cmV0dXJuIGhlaWdodDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZW1wbGF0aXplciBjbGVhbnMgdXAgdGVtcGxhdGUgdGFncyBhbmQgaW5zZXJ0IHRoZSBpbm5lciBodG1sIGJlZm9yZSB0aGUgdGFnXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBDb250YWlucyBhbGwgcHJvcGVydGllc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLnRlbXBsYXRlTmFtZSAtIERlZmluZXMgdGhlIHRlbXBsYXRlIG5hbWUgd2hpY2ggaXMgYSBzZWxlY3RvciBmcm9tIHRoZSBlbGVtZW50XHJcbiAqL1xyXG5IZWxwZXJzLnRlbXBsYXRpemVyID0gZnVuY3Rpb24ob2JqKSB7XHJcblx0aWYgKCEnY29udGVudCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKSkgcmV0dXJuO1xyXG5cdGlmICghb2JqICYmICFvYmoudGVtcGxhdGVOYW1lKSB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBuZWVkIHRvIHBhc3MgYSB0ZW1wbGF0ZSBuYW1lc3BhY2UgYXMgc3RyaW5nIScpO1xyXG5cclxuXHRIZWxwZXJzLnF1ZXJ5U2VsZWN0b3JBcnJheShvYmoudGVtcGxhdGVOYW1lKS5mb3JFYWNoKGZ1bmN0aW9uKHRwbCkge1xyXG5cdFx0bGV0IHBhcmVudCA9IHRwbC5wYXJlbnROb2RlO1xyXG5cdFx0bGV0IGNvbnRlbnQgPSB0cGwuY29udGVudC5jaGlsZHJlblswXTtcclxuXHJcblx0XHRwYXJlbnQuaW5zZXJ0QmVmb3JlKGNvbnRlbnQsIHRwbCk7XHJcblx0fSk7XHJcbn07XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIE9USEVSIEhFTFBFUlNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZSBjbGljayBoYW5kbGVyLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5IZWxwZXJzLmNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiBIZWxwZXJzLmlzVG91Y2goKSA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljayc7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgc2NyaXB0IGlzIGFscmVhZHkgYWRkZWQsXHJcbiAqIGFuZCByZXR1cm5zIHRydWUgb3IgZmFsc2VcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTCB0byB5b3VyIHNjcmlwdFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuSGVscGVycy5jaGVja1NjcmlwdCA9IGZ1bmN0aW9uKHVybCkge1xyXG5cdGxldCB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XHJcblx0bGV0IHNjcmlwdEFkZGVkID0gZmFsc2U7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKHhbaV0uc3JjID09IHVybCkge1xyXG5cdFx0XHRzY3JpcHRBZGRlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBzY3JpcHRBZGRlZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMb2FkIHNjcmlwdHMgYXN5bmNocm9ub3VzLFxyXG4gKiBjaGVjayBpZiBzY3JpcHQgaXMgYWxyZWFkeSBhZGRlZCxcclxuICogb3B0aW9uYWwgY2hlY2sgaWYgc2NyaXB0IGlzIGZ1bGx5IGxvYWRlZCBhbmRcclxuICogZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTCB0byB5b3VyIHNjcmlwdFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja0ZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHBhcmFtIHtPYmplY3R9IGNhbGxiYWNrT2JqIC0gdGhpcyBjb250ZXh0XHJcbiAqL1xyXG5IZWxwZXJzLmxvYWRTY3JpcHQgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrRm4sIGNhbGxiYWNrT2JqKSB7XHJcblx0bGV0IHNjcmlwdEFkZGVkID0gSGVscGVycy5jaGVja1NjcmlwdCh1cmwpO1xyXG5cdGxldCBzY3JpcHQ7XHJcblxyXG5cdGlmIChzY3JpcHRBZGRlZCA9PT0gZmFsc2UpIHtcclxuXHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcblx0XHRzY3JpcHQuc3JjID0gdXJsO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG5cdH1cclxuXHJcblx0aWYgKGNhbGxiYWNrRm4gJiYgdHlwZW9mKGNhbGxiYWNrRm4pID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdGlmIChzY3JpcHRBZGRlZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRjYWxsYmFja0ZuLmFwcGx5KGNhbGxiYWNrT2JqKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoeC5yZWFkeVN0YXRlID09ICdjb21wbGV0ZScpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrRm4uYXBwbHkoY2FsbGJhY2tPYmopO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNhbGxiYWNrRm4uYXBwbHkoY2FsbGJhY2tPYmopO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuSGVscGVycy5oYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGNsYXNzTmFtZSkge1xyXG5cdGxldCBlbCA9IGVsZW07XHJcblxyXG5cdGlmICgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIEhlbHBlcnMucmVnRXhwKGNsYXNzTmFtZSkudGVzdChlbC5jbGFzc05hbWUpO1xyXG5cdH1cclxufTtcclxuXHJcbkhlbHBlcnMuYWRkQ2xhc3MgPSBmdW5jdGlvbihlbGVtLCBjbGFzc05hbWUpIHtcclxuXHRsZXQgZWwgPSBlbGVtO1xyXG5cclxuXHRpZiAoJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGlmICghSGVscGVycy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xyXG5cdFx0XHRlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuSGVscGVycy5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW0sIGNsYXNzTmFtZSkge1xyXG5cdGxldCBlbCA9IGVsZW07XHJcblxyXG5cdGlmICgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShIZWxwZXJzLnJlZ0V4cChjbGFzc05hbWUpLCAnICcpO1xyXG5cdH1cclxufTtcclxuXHJcblxyXG4vKipcclxuICogQWRkL1VwZGF0ZSBhIHBhcmFtZXRlciBmb3IgZ2l2ZW4gdXJsXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHVzZSBIZWxwZXJzLnVwZGF0ZVVybCBpbnN0ZWFkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSB1cmwgb24gd2hpY2ggdGhlIHBhcmFtZXRlciBzaG91bGQgYmUgYWRkZWQgLyB1cGRhdGVkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbU5hbWUgLSBwYXJhbWV0ZXIgbmFtZVxyXG4gKiBAcGFyYW0geyhTdHJpbmd8TnVtYmVyKX0gcGFyYW1WYWx1ZSAtIHBhcmFtZXRlciB2YWx1ZVxyXG4gKlxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IC0gdXJsXHJcbiAqL1xyXG5IZWxwZXJzLmFkZFBhcmFtVG9VcmwgPSBmdW5jdGlvbih1cmwsIHBhcmFtTmFtZSwgcGFyYW1WYWx1ZSkge1xyXG5cdGxldCBwYXJhbXMgPSB7fTtcclxuXHJcblx0cGFyYW1zW3BhcmFtTmFtZV0gPSBwYXJhbVZhbHVlO1xyXG5cclxuXHRyZXR1cm4gSGVscGVycy51cGRhdGVVcmwodXJsLCBwYXJhbXMpO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBBZGQvVXBkYXRlIG11bHRpcGxlIHBhcmFtZXRlcnMgZm9yIGdpdmVuIHVybFxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gdXJsIG9uIHdoaWNoIHBhcmFtZXRlcnMgc2hvdWxkIGJlIGFkZGVkIC8gdXBkYXRlZFxyXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gcGFyYW1ldGVycyAobmFtZS92YWx1ZSlcclxuICpcclxuICogQHJldHVybiB7U3RyaW5nfSAtIHJlc3VsdGluZyB1cmxcclxuICovXHJcbkhlbHBlcnMudXBkYXRlVXJsID0gZnVuY3Rpb24odXJsLCBwYXJhbXMpIHtcclxuXHRsZXQgdXJsUGFydHMgPSB1cmwuc3BsaXQoJz8nKTtcclxuXHRsZXQgdG1wUGFyYW1zID0gW107XHJcblx0bGV0IG9yaWdpbmFsUGFyYW1zID0gW107XHJcblx0bGV0IG5ld1BhcmFtcyA9IFtdO1xyXG5cdGxldCBiYXNlVXJsID0gJyc7XHJcblx0bGV0IHByb3BlcnR5ID0gJyc7XHJcblx0bGV0IHVwZGF0ZWQgPSBmYWxzZTtcclxuXHRsZXQgaSA9IDA7XHJcblx0bGV0IGogPSAwO1xyXG5cclxuXHRmb3IgKHByb3BlcnR5IGluIHBhcmFtcykge1xyXG5cdFx0aWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuXHRcdFx0dG1wUGFyYW1zLnB1c2goW3Byb3BlcnR5LCAnPScsIHBhcmFtc1twcm9wZXJ0eV1dLmpvaW4oJycpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGJhc2VVcmwgPSB1cmxQYXJ0c1swXTtcclxuXHRvcmlnaW5hbFBhcmFtcyA9IHVybFBhcnRzLmxlbmd0aCA+IDEgPyB1cmxQYXJ0c1sxXS5zcGxpdCgnJicpIDogW107XHJcblxyXG5cdGZvciAoaTsgaSA8IHRtcFBhcmFtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dXBkYXRlZCA9IGZhbHNlO1xyXG5cclxuXHRcdGZvciAoaiA9IDA7IGogPCBvcmlnaW5hbFBhcmFtcy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRpZiAodG1wUGFyYW1zW2ldICYmIG9yaWdpbmFsUGFyYW1zW2pdLnNwbGl0KCc9JylbMF0gPT09IHRtcFBhcmFtc1tpXS5zcGxpdCgnPScpWzBdKSB7XHJcblx0XHRcdFx0b3JpZ2luYWxQYXJhbXNbal0gPSB0bXBQYXJhbXNbaV07XHJcblx0XHRcdFx0dXBkYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXVwZGF0ZWQpIHtcclxuXHRcdFx0bmV3UGFyYW1zLnB1c2godG1wUGFyYW1zW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiAoW2Jhc2VVcmwsICc/Jywgb3JpZ2luYWxQYXJhbXMuY29uY2F0KG5ld1BhcmFtcykuam9pbignJicpXS5qb2luKCcnKSk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhbHBoYW51bWVyaWMgaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbGVuZ3RoPTVdIC0gbGVuZ3RoIG9mIGdlbmVyYXRlZCBpZC5cclxuICpcclxuICogQHJldHVybiB7U3RyaW5nfSAtIGdlbmVyYXRlZCBpZFxyXG4gKi9cclxuSGVscGVycy5tYWtlSWQgPSBmdW5jdGlvbihsZW5ndGgpIHtcclxuXHRsZXQgaWRMZW5ndGggPSBsZW5ndGggfHwgNTtcclxuXHRsZXQgY2hhclBvb2wgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xyXG5cdGxldCBpID0gMDtcclxuXHRsZXQgaWQgPSAnJztcclxuXHJcblx0Zm9yICg7IGkgPCBpZExlbmd0aDsgaSsrKVxyXG5cdFx0aWQgKz0gY2hhclBvb2wuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJQb29sLmxlbmd0aCkpO1xyXG5cclxuXHRyZXR1cm4gaWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWxwZXJzOyJdfQ==

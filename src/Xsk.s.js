/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */

if (!Xsk.s) Xsk.s = {};

Xsk.s.drawInto = function(html, css, element) {
	if (element && Xsk.s.isDOMElement(element)) {
		if (css) {
			// TODO: fix top-level class
			if (!css.match(/^<style>/i)) css = '<style>'+css;
			if (!css.match(/<\/style>$/i)) css = css+'</style>';
			Xsk.s.appendSanitizedHtmlTo(css, element);
		}

		if (html) {
			// TODO: fix top-level class
			// TODO: fix id's
			Xsk.s.appendSanitizedHtmlTo(html, element);
		}
	}
};

Xsk.s.isDOMNode = function(obj) {
	try {
		return (obj && obj.cloneNode) ? !!obj.cloneNode(false) : false;
	} catch(er) {
		return false;
	}
};

Xsk.s.isDOMElement = function(obj) {
	return (Xsk.s.isDOMNode(obj) && !!obj.tagName);
};

Xsk.s.isInDOM = function(obj) {
	do {
		if (obj == document.documentElement) {
			return true;
		}
	} while (obj = obj.parentNode)
	return false;
};

Xsk.s.extend = Object.assign ? Object.assign : function() {
	// copy the extenders' properties over to the extendee
	for (var i = 1; i < arguments.length; i++) {
		for (var key in arguments[i]) {
			if (arguments[i].hasOwnProperty(key)) {
				arguments[0][key] = arguments[i][key];
			}
		}
	}	

	return arguments[0];
};

Xsk.s.proxy = function(func, context) {
	var func_bound = null;

	if (func) {
		if (!func.bind) {
			// based on polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
			func.bind = function(oThis) {
				if (typeof this !== 'function') {
				  // closest thing possible to the ECMAScript 5
				  // internal IsCallable function
				  throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
				}

				var aArgs   = Array.prototype.slice.call(arguments, 1),
					fToBind = this,
					fNOP    = function() {},
					fBound  = function() {
					  return fToBind.apply(this instanceof fNOP
							 ? this
							 : oThis,
							 aArgs.concat(Array.prototype.slice.call(arguments)));
					};

				if (this.prototype) {
				  // Function.prototype doesn't have a prototype property
				  fNOP.prototype = this.prototype; 
				}
				fBound.prototype = new fNOP();

				return fBound;
			};
		}
		func_bound = func.bind(context); // IMPROVE ME: check if is function
	}
	
	return func_bound;
};

Xsk.s.supportsTouch = function() {
	return ("createTouch" in document && "ongesturestart" in window);
/*
   var el = document.createElement('node');
   el.setAttribute('ongesturestart', 'return;');
   if(typeof el.ongesturestart == "function"){
      return true;
   }else {
      return false
   }
*/
};

Xsk.s.bootstrap = function(html, css, element) {
	var instances = {};
	
	Xsk.s.drawInto(html, css, element);

	var $nodes = $(element).find('*');
	for (var i = $nodes.length-1; i >= 0; i--) {
		var node = $nodes.get(i);
		var instanceId = node.getAttribute('id') || 's'+String(Math.random()).replace('.', '');
		var cl = node.getAttribute('class');
		if (cl) {
			var classes = cl.split(' ');
			for (var j = 0; j < classes.length; j++) {
				// The essense of XSK is translating html classes to actual Class names, according to this convention
				var className = classes[j].toLowerCase().split('-').map(function(word){ return word[0].toUpperCase()+word.substr(1); }).join('.');
				if (className === 'Xsk.Ux.Button') {
					instances[instanceId] = new Xsk.Ux.Button(node);
				} else if ((closure_global || window)[className]) {
					instances[instanceId] = new (closure_global || window)[className](node);
				} else {
					try {
//console.debug("going to eval: "+"if (typeof "+className+" === 'function') instances[instanceId] = new "+className+"(node);");
						eval("if (typeof "+className+" === 'function') instances[instanceId] = new "+className+"(node);");
					} catch(er) {
console.debug("error: "+er);
					}
				}
			}
		}
	}

	return instances;
};

Xsk.s.getCookie = function(c_name) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) {
			return unescape(y);
		}
	}
};

Xsk.s.setCookie = function(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString())+";path=/";
	document.cookie=c_name + "=" + c_value;
};

/**
 * Sanitize html and append it to target element's content
 *
 * @param mixed html (String, Object or Number)
 * @param string target element
 */
Xsk.s.appendSanitizedHtmlTo = function(html, target) {
	if (Xsk.s.isDOMElement(target)) {
		if (typeof html !== 'undefined') {
			var sanitized = Xsk.s._getSanitizedNodes(html, target.localName);
			if (sanitized) {
				if (typeof sanitized.forEach === 'function') { // is iterable
					sanitized.forEach(function(currentValue){ target.appendChild(currentValue); });				
				} else { // single text node
					target.appendChild(sanitized);
				}
			}
		}
	}
};

/**
 * Sanitize html and set it as target element's content
 *
 * @param mixed html (String, Object or Number)
 * @param string targetTagName (optional)
 */
Xsk.s.setSanitizedHtmlTo = function(html, target) {
	if (Xsk.s.isDOMElement(target)) {
		target.innerHTML = ''; // empty
		Xsk.s.appendSanitizedHtmlTo(html, target);
	}
};

/**
 * Parse html into sanitized nodes
 *
 * @param mixed html (String, Object or Number)
 * @param string targetTagName (optional)
 * @return mixed nodes (NodeList, Node or FALSE on error)
 */
Xsk.s._getSanitizedNodes = function(html, targetTagName) {
	var ret = false;

	if (typeof html === 'string' || html instanceof String) { // typeof catches string primitives, instanceof catches string Objects
		if (typeof DOMParser !== 'undefined' && false) {
			var parser = new DOMParser();
			var nodes = parser.parseFromString(html, 'text/html').body.childNodes;
		} else {
			if (!targetTagName) targetTagName = 'div'; // or 'table, or 'template'
			var sandbox = document.createElement(targetTagName);
			sandbox.setAttribute('id', '__sandbox__');
			sandbox.innerHTML = html;
			var nodes = sandbox.querySelectorAll(targetTagName+'#__sandbox__ > *'); // discards html comments and text nodes
			if (!nodes || nodes.length === 0) nodes = sandbox.childNodes; // includes text nodes
		}
		if (nodes && typeof nodes.forEach === 'function') {
			nodes.forEach(function(currentValue){ Xsk.s._sanitizeNode_r(currentValue); });
			ret = nodes;
		}
	} else if (typeof html === 'number' || !isNaN(parseFloat(html)))  { // Number
		ret = document.createTextNode(parseFloat(html));
	}
	
	return ret;
};

// *RECURSIVE*
Xsk.s._sanitizeNode_r = function(node){
	if (node) {
		if (node.localName) {
			if (node.localName.match(/script/i)) node.textContent = '';
		}
		if (node.hasAttributes && node.hasAttributes() && node.attributes) {
			for (var i = node.attributes.length - 1; i >= 0; i--) { // backward for efficiency
				var attr = node.attributes[i];
				if (attr && attr.name.match(/^on/i)) attr.value = ""; // empty event handlers in order to avoid XSS!
				if (attr && attr.name.match(/^src/i) && attr.value.match(/^javascript:/i)) attr.value = ""; // empty javascript: src in order to avoid XSS!
				if (attr && attr.name.match(/^src/i) && attr.value.match(/^data:text\/javascript/i)) attr.value = ""; // empty data:text/javascript src in order to avoid XSS!
				if (attr && attr.name.match(/^href/i) && attr.value.match(/^javascript:/i)) attr.value = ""; // empty javascript: href in order to avoid XSS!
				if (attr && attr.name.match(/^href/i) && attr.value.match(/^data:text\/javascript/i)) attr.value = ""; // empty data:text/javascript href in order to avoid XSS!
				if (attr && attr.name.match(/^action/i) && attr.value.match(/^javascript:/i)) attr.value = ""; // empty javascript: action in order to avoid XSS!
				if (attr && attr.name.match(/^action/i) && attr.value.match(/^data:text\/javascript/i)) attr.value = ""; // empty data:text/javascript action in order to avoid XSS!
				if (attr && attr.name.match(/^srcdoc/i)) attr.value = ""; // empty srcdoc in order to avoid XSS!
			}
		}
		if (node.childNodes && typeof node.childNodes.forEach === 'function') {
			node.childNodes.forEach(function(currentValue){ Xsk.s._sanitizeNode_r(currentValue); });
		}
	}
};

/**
 * Copyright Heads First 2020
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Switch = function(element) {
	this._init(element);
};
Xsk.Switch.prototype = Xsk.s.extend({}, Xsk.prototype);

Xsk.Switch.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.prototype._init, this)(element); // super
	this.className = 'Xsk.Switch';
	
	this._variable = null;
	
	this.on('updated', Xsk.s.proxy(this._onUpdated, this)); // MOVE ME: to Xsk.js ?
	
	this._onUpdated({});
};

Xsk.Switch.prototype.exit = function() {
	this.off('updated', Xsk.s.proxy(this._onUpdated, this)); // MOVE ME: to Xsk.js ?

	return Xsk.s.proxy(Xsk.prototype.exit, this)(); // super
};

Xsk.Switch.prototype._onUpdated = function(ev) {
	var update = {};
	if (this._element && this._element.hasAttribute('data-variable')) {
		update['variable'] = this._element.getAttribute('data-variable'); // eval?
	}
	this.update(update);
};

Xsk.Switch.prototype.update = function(update) {
	if (update && typeof update['variable'] !== 'undefined') {
		this._variable = update['variable'];
	}
	
	var matchedLabel = false;
	for (var i = 0, il = this._children.length(); i < il; i++) {
		var child = this._children[i];
		if (child.className === 'Xsk.Switch.Case') {
			if (child.label === this._variable) {
				matchedLabel = true;
				child.restore();
			} else {
				child.suspend();
			}
		}
	}
	for (var i = 0, il = this._children.length(); i < il; i++) {
		if (child.className === 'Xsk.Switch.Default') {
			if (!matchedLabel) {
				child.restore();
			} else {
				child.suspend();
			}
		}
	}
};

Xsk.Switch.prototype.restore = function() {
	this._element.setAttribute('style', this._element.getAttribute('style').replace(/display:[^;}]*/, '')+'display:block;')
	//this.enable();
};

Xsk.Switch.prototype.suspend = function() {
	this._element.setAttribute('style', this._element.getAttribute('style').replace(/display:[^;}]*/, '')+'display:none;')
	//this.disable();
};



Xsk.Switch.Case = function(element) {
	this._init(element);
};
Xsk.Switch.Case.prototype = Xsk.s.extend({}, Xsk.Switch.prototype);

Xsk.Switch.Case.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Switch.prototype._init, this)(element); // super
	this.className = 'Xsk.Switch.Case';
		
	this._label = null;
	if (this._element && this._element.hasAttribute('data-label')) {
		this._label = this._element.getAttribute('data-label'); // eval?
	}

	if (Object.defineProperty) Object.defineProperty(this, 'label', { get: Xsk.s.proxy(function(){ return this._label; }, this) });
};



Xsk.Switch.Default = function(element) {
	this._init(element);
};
Xsk.Switch.Default.prototype = Xsk.s.extend({}, Xsk.Switch.prototype);

Xsk.Switch.Default.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Switch.prototype._init, this)(element); // super
	this.className = 'Xsk.Switch.Default';
};

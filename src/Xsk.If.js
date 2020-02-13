/**
 * Copyright Heads First 2020
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.If = function(element) {
	this._init(element);
};
Xsk.If.prototype = Xsk.s.extend({}, Xsk.prototype);

Xsk.If.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.prototype._init, this)(element); // super
	this.className = 'Xsk.If';
	
	this._condition = false;
	
	this.on('updated', Xsk.s.proxy(this._onUpdated, this)); // MOVE ME: to Xsk.js ?
	
	this._onUpdated({});
};

Xsk.If.prototype.exit = function() {
	this.off('updated', Xsk.s.proxy(this._onUpdated, this)); // MOVE ME: to Xsk.js ?

	return Xsk.s.proxy(Xsk.prototype.exit, this)(); // super
};

Xsk.If.prototype._onUpdated = function(ev) {
	var update = {};
	if (this._element && this._element.hasAttribute('data-condition')) {
		update['condition'] = (this._element.getAttribute('data-condition') === 'true'); // eval?
	}
	this.update(update);
};

Xsk.If.prototype.update = function(update) {
	if (update && typeof update['condition'] !== 'undefined') {
		this._condition = update['condition'];
	}
	
	var classNameToRestore = (this._condition) ? 'Xsk.If.Then' : 'Xsk.If.Else';
	var classNameToSuspend = (this._condition) ? 'Xsk.If.Else' : 'Xsk.If.Then';
	for (var i = 0, il = this._children.length(); i < il; i++) {
		var child = this._children[i];
		if (child.className === classNameToRestore) child.restore();
		if (child.className === classNameToSuspend) child.suspend();
	}
};

Xsk.If.prototype.restore = function() {
	this._element.setAttribute('style', this._element.getAttribute('style').replace(/display:[^;}]*/, '')+'display:block;')
	//this.enable();
};

Xsk.If.prototype.suspend = function() {
	this._element.setAttribute('style', this._element.getAttribute('style').replace(/display:[^;}]*/, '')+'display:none;')
	//this.disable();
};



Xsk.If.Then = function(element) {
	this._init(element);
};
Xsk.If.Then.prototype = Xsk.s.extend({}, Xsk.If.prototype);

Xsk.If.Then.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.If.prototype._init, this)(element); // super
	this.className = 'Xsk.If.Then';
};



Xsk.If.Else = function(element) {
	this._init(element);
};
Xsk.If.Else.prototype = Xsk.s.extend({}, Xsk.If.prototype);

Xsk.If.Else.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.If.prototype._init, this)(element); // super
	this.className = 'Xsk.If.Else';
};

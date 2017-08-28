/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
var Xsk = function(element) {
	this._init(element);
};

Xsk.prototype._init = function(element) {
	if (element) this._element = element;
	this._ns = 'Xsk'+String(Math.random()).replace('.', '');
};

Xsk.prototype.exit = function() {
	// maybe unbind all events?
	return null;
};

Xsk.prototype.on = function(eventType, handler) {
	$(this._element).on(eventType, handler);
};

Xsk.prototype.off = function(eventType) {
	$(this._element).off(eventType);
};

/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux = function(element) {
	this._init(element);
};
Xsk.Ux.prototype = Xsk.s.extend({}, Xsk.prototype);

Xsk.Ux.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.prototype._init, this)(element); // super
};

Xsk.Ux.prototype.exit = function() {
	return Xsk.s.proxy(Xsk.prototype.exit, this)(); // super
};
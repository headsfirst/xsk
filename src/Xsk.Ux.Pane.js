/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux.Pane = function(element) {
	this._init(element);
};
Xsk.Ux.Pane.prototype = Xsk.s.extend({}, Xsk.Ux.prototype);

Xsk.Ux.Pane.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Ux.prototype._init, this)(element); // super
};

Xsk.Ux.Pane.prototype.exit = function() {
	return Xsk.s.proxy(Xsk.Ux.prototype.exit, this)(); // super
};
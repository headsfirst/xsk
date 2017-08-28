/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux.Container = function(element) {
	this._init(element);
};
Xsk.Ux.Container.prototype = Xsk.s.extend({}, Xsk.Ux.prototype);

Xsk.Ux.Container.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Ux.prototype._init, this)(element); // super
};

Xsk.Ux.Container.prototype.exit = function() {
	return Xsk.s.proxy(Xsk.Ux.prototype.exit, this)(); // super
};

Xsk.Ux.Container.prototype.setContents = function(contents) {
	if (contents || contents == "") $(this._element).empty().xsk_htmlSanitized(contents);	
};

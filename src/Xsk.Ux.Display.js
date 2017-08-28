/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux.Display = function(element) {
	this._init(element);
};
Xsk.Ux.Display.prototype = Xsk.s.extend({}, Xsk.Ux.prototype);

Xsk.Ux.Display.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Ux.prototype._init, this)(element); // super

	if (this._element) {
		this._name = this._element.getAttribute('data-name');
		this._type = this._element.getAttribute('data-type') || 'text';
	
		this._input = document.createElement('input');
		this._input.setAttribute('disabled', 'disabled');
		this._input.setAttribute('name', this._name);
		this._input.setAttribute('type', this._type);
		$(this._element).append(this._input);
	}
};

Xsk.Ux.Display.prototype.exit = function() {
	return Xsk.s.proxy(Xsk.Ux.prototype.exit, this)(); // super
};

Xsk.Ux.Display.prototype.setValue = function(value) {
	$(this._input).val(value);
};

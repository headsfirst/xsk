/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux.Button = function(element) {
	this._init(element);
};
Xsk.Ux.Button.prototype = Xsk.s.extend({}, Xsk.Ux.prototype);

Xsk.Ux.Button.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Ux.prototype._init, this)(element); // super

	this._callback = null;

	if (this._element) {
		this._name = this._element.getAttribute('data-name');
		this._type = this._element.getAttribute('data-type');
		this._label = this._element.getAttribute('data-label');

		this._span = document.createElement('span');
		this._button = document.createElement('button');
		if (this._name) this._button.setAttribute('name', this._name);
		if (this._type) this._button.setAttribute('type', this._type);
		
		if ($(this._element).children().length) $(this._element).children().wrapAll(this._span); else $(this._element).append(this._span);
		if ($(this._element).children().length) $(this._element).children().wrapAll(this._button); else $(this._element).append(this._button);

		if (this._label) {
			var spans = this._element.querySelectorAll('button span');
			if (spans && typeof spans.forEach === 'function') {
				var label = this._label;
				spans.forEach(function(currentValue){ Xsk.s.appendSanitizedHtmlTo(label, currentValue); });
			}
		}
	}
};

Xsk.Ux.Button.prototype.exit = function() {
	return Xsk.s.proxy(Xsk.Ux.prototype.exit, this)(); // super
};

closure_global['Xsk.Ux.Button'] = Xsk.Ux.Button;
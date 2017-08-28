/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux.Toggle = function(element) {
	this._init(element);
};
Xsk.Ux.Toggle.prototype = Xsk.s.extend({}, Xsk.Ux.prototype);

Xsk.Ux.Toggle.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Ux.prototype._init, this)(element); // super

	if (this._element) {
		$(this._element).children().css({'position':'relative'});

		this._toggleIndex = -1;	
		this.toggle();
		this.on('click.'+this._ns, Xsk.s.proxy(this._onClick, this));
	}
};

Xsk.Ux.Toggle.prototype.exit = function() {
	this.off('click.'+this._ns);

	return Xsk.s.proxy(Xsk.Ux.prototype.exit, this)(); // super
};

Xsk.Ux.Toggle.prototype.setContents = function(contents) {
	if (contents || contents == "") $(this._element).empty().xsk_htmlSanitized(contents);	
};

Xsk.Ux.Toggle.prototype.toggle = function() {
	if (this._element) {
		var $children = $(this._element).children();
		this._toggleIndex++;
		if (this._toggleIndex >= $children.length) this._toggleIndex = 0;
		Xsk.Ux.Toggle.elementToFront($children.get(this._toggleIndex));
	}
};

Xsk.Ux.Toggle.prototype.viewChildById = function(id) {
	if (this._element) {
		var $children = $(this._element).children();
		var i = $children.length-1;
		while (i >= 0) {
			if ($children.get(i).getAttribute('id') === id) break;
			i--;
		}
		if (i >= 0) { // found
			this._toggleIndex = i;
			Xsk.Ux.Toggle.elementToFront($children.get(this._toggleIndex));
		}
	}
};

Xsk.Ux.Toggle.elementToFront = function(element) {
	if (element) $(element).css({'zIndex':1, 'display':'inline-block'}).siblings().css({'zIndex':0, 'display':'none'});
};

Xsk.Ux.Toggle.prototype._onClick = function(ev) {
	if (ev.target.tagName == 'INPUT' || ev.target.tagName == 'BUTTON') return;
	this.toggle();
};
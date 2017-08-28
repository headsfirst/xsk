/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux.Stack = function(element) {
	this._init(element);
};
Xsk.Ux.Stack.prototype = Xsk.s.extend({}, Xsk.Ux.prototype);

Xsk.Ux.Stack.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Ux.prototype._init, this)(element); // super

	if (this._element) {
		this._toggle = (this._element.getAttribute('data-toggle') === 'true');

		$(this._element).children().css({'position':'absolute','top':0,'left':0});

		if (this._toggle) {
			this._toggleIndex = -1;	
			this.toggle();
			this.on('click.'+this._ns, Xsk.s.proxy(this._onClick, this));
		}
	}
};

Xsk.Ux.Stack.prototype.exit = function() {
	this.off('click.'+this._ns);

	return Xsk.s.proxy(Xsk.Ux.prototype.exit, this)(); // super
};

Xsk.Ux.Stack.prototype.setContents = function(contents) {
	if (contents || contents == "") $(this._element).empty().xsk_htmlSanitized(contents);	
};

Xsk.Ux.Stack.prototype.toggle = function() {
	if (this._element) {
		var $children = $(this._element).children(); // use contents()?
		this._toggleIndex++;
		if (this._toggleIndex >= $children.length) this._toggleIndex = 0;
		Xsk.Ux.Stack.elementToFront($children.get(this._toggleIndex));
	}
};

Xsk.Ux.Stack.prototype.viewChildById = function(id) {
	if (this._element) {
		var $children = $(this._element).children(); // use contents()?
		var i = $children.length-1;
		while (i >= 0) {
			if ($children.get(i).getAttribute('id') === id) break;
			i--;
		}
		if (i >= 0) { // found
			this._toggleIndex = i;
			Xsk.Ux.Stack.elementToFront($children.get(this._toggleIndex));
		}
	}
};

Xsk.Ux.Stack.elementToFront = function(element) {
	if (element) $(element).css({'zIndex':1, 'visibility':'visible'}).siblings().css({'zIndex':0, 'visibility':'hidden'});
};

Xsk.Ux.Stack.prototype._onClick = function(ev) {
	this.toggle();
};
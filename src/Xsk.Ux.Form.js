/**
 * Copyright Heads First - Icoontje 2017
 *
 * Author(s): J. Koppen ( j.koppen -at- headsfirst.nl ) 
 */
 
Xsk.Ux.Form = function(element) {
	this._init(element);
};
Xsk.Ux.Form.prototype = Xsk.s.extend({}, Xsk.Ux.prototype);

Xsk.Ux.Form.prototype._init = function(element) {
	Xsk.s.proxy(Xsk.Ux.prototype._init, this)(element); // super

	this._callback = null;

	if (this._element) {
		this._action = this._element.getAttribute('data-action') || '#';

		var elm = document.createElement('form');
		elm.setAttribute('action', this._action);
		//$(this._element).append(elm);
		$(this._element).children().wrapAll(elm);
	}
	this.on('submit.'+this._ns, Xsk.s.proxy(this._onSubmit, this));
};

Xsk.Ux.Form.prototype.exit = function() {
	this.off('submit.'+this._ns);

	return Xsk.s.proxy(Xsk.Ux.prototype.exit, this)(); // super
};

Xsk.Ux.Form.prototype.setAction = function(action) {
	if (action) this._action = action;

	$(this._element).find('form').attr('action', this._action);
};

Xsk.Ux.Form.prototype.setCallback = function(callback) {
	if (callback) this._callback = callback;
};

Xsk.Ux.Form.prototype._onSubmit = function(ev) {
	ev.preventDefault();
	
	var $form = $(ev.target);
	$form.find('button[type=submit]').prop('disabled', true);

	var params = {};
	$form.find('input,button').each(function() { // NB textarea, select?
		if (typeof this['name'] != 'undefined' && this['name'] != "") {
			params[this['name']] = $(this).val();
		}
	});

	var action = $form.attr('action');
	var remote = (action.match(/^\/\//) != null || action.match(/:\/\//) != null);
	$.ajax({
		url: action,
		data: params,
		context: this,
		dataType: (remote ? 'jsonp' : 'json'),
		success: function(data) {
			$form.find('button[type=submit]').prop('disabled', false);
			if (this._callback) this._callback(true, data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$form.find('button[type=submit]').prop('disabled', false);
			if (this._callback) this._callback(false, textStatus);
		}
	});
	
	return false; // prevent default and stop propagation?!?
};

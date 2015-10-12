/* --- Site interface --- */
var site = {
	ui: {},
	app: {},
	models: {},
	views: {},
	effects: {},
	loading: {},
	sizes: {},
	content: {},
	plugins: {},
	status: {},
	loader: {},
	device: {},
	storage: {},
	settings: {},
	template: {},
	address: {}
};


/* --- Root blocks --- */
var $root = $('#root'),
    $html = $('html'),
    $body = $('body'),
    $document = $(document),
    $window = $(window),
	$page_wrapper = $root.find('.page__wrapper'),
	$page_content = $page_wrapper.find('.page__content'),
	clickEvent,
	debug_mode = "";


/* --- Version --- */
site.version = $root.data('version');


/* --- Prefixed styles --- */
var prefixed = {
	'animation': Modernizr.prefixed('animation'),
	'transform': Modernizr.prefixed('transform'),
	'transform-origin': Modernizr.prefixed('transformOrigin'),
	'transition': Modernizr.prefixed('transition')
};


/*** --- Status --- ***/
site.status = function(status, add){

	var body = $body[0];
	
	if (!status) return false;
	
	status = 'state__' + status;
	
	if (add && !body.className.match(status)){
		body.className += ' ' + status;
	}
	else if (!add){
		body.className = trim((body.className || '').replace((new RegExp('(\\s|^)' + status + '(\\s|$)')), ' '));
	}
};

var trim = function(text) {
	return (text || '').replace(/^\s+|\s+$/g, ''); 
};

/*** --- Dataset helper --- ***/
$.fn.api = function(key){
	return this.data(key) ? this.data(key) : this.data(key, {}).data(key);
};
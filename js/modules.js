(function(loading, loader){

	site.loading = function(preloading, callback){

		var $preloader = $root.find('.YS__ui-preloader');
		
		if ($preloader.length){
		
			var $spinner = $preloader.find('.YS__ui-spinner');
			
			// {fn} hide preloader
			var hide = function(callback, delay){
				$spinner.delay(delay || 0).velocity({
					opacity: 0
				}, 'easeOutCubic', 175, function(){
					$spinner.remove();
					if (callback) callback();
				});
			};
			// api
			$spinner.data('spinner', { hide:hide });
			
			var spinner = $spinner.api('spinner');
			
			// {fn} hide
			var hidePreloader = function(){
				spinner.hide(function(){
					site.status("preloading", false);
					$preloader.velocity({ opacity:0 }, 450, function(){
						$preloader.remove();
					});
				});
			};
			// {fn} start
			var start = function(){
				if (callback) callback();
				hidePreloader();
			};
			// {event} window load
			if (preloading == "not_preload"){
				start();
			}
			else {
				loader.images($root.find(".image__preloading"), start);
			}
		}
		else {
			site.status("preloading", false);
			if (callback) loader.images($root, callback);
		}
	};
	
})(site.loading, site.loader);

(function(loader, ui){

	// {fn} load images
	loader.images = function($block, complete, callback){
		var loaded = 0;
		// check callbacks
		complete = complete || $.noop;
		callback = callback || $.noop;
		// init plugin
		$block.imagesLoaded().always(complete).progress(function(instance){
			loaded++;
			callback(loaded, instance.images.length)
		});
	};
	
	// {fn} load percent
	loader.percent = {
	
		init: function(block){
			var _this = loader.percent;
			
			_this.container = block;
			
			if (!ui.loadingPercentage){
				ui.loadingPercentage = $('<div class="YS__ui-preloader__percentage"></div>');
				ui.loadingPercentageTitle = $('<div class="YS__ui-preloader__percentage__title">0</div>');
				ui.loadingPercentageLine = $('<div class="YS__ui-preloader__percentage__line"></div>');
				ui.loadingPercentage.append(ui.loadingPercentageTitle);
				ui.loadingPercentage.append(ui.loadingPercentageLine);
			}
			_this.loadingStart = true;
			_this.loadingTimer = "";
			_this.loadingPercent = 0;
			_this.status(0);		
			_this.container.append(ui.loadingPercentage);
			_this.progress();
		},
		progress: function(loaded, quantity){
			var _this = loader.percent;
			
			if (_this.container && _this.loadingStart){
				if (loaded && quantity){
					var p = ((loaded / quantity) * 100).toFixed(0);
					if (p > 75){
						clearInterval(_this.loadingTimer);
						_this.status(p);
					}
					if (loaded == quantity){
						_this.loadingStart = false;
					}				
				}
				else {
					_this.loadingTimer = setInterval(function(){
						_this.loadingPercent += site.plugins.rand(1, 5);
						_this.status(_this.loadingPercent);
						if (_this.loadingPercent > 75){
							clearInterval(_this.loadingTimer);
						}
					}, 55);
				}
			}
		},
		status: function(data){
			ui.loadingPercentageTitle[0].innerHTML = data;
			ui.loadingPercentageTitle[0].style.bottom = data + "%";
			ui.loadingPercentageLine[0].style.height = data + "%";			
		}
	};
	
})(site.loader, site.ui);

(function(sizes){
	// {fn} update sizes
	var updateSizes = function(){
		sizes.width = $window.width();
		sizes.height = parseInt(window.innerHeight,10);
	};
	// {event} window resize
	$window.on('resize.site', updateSizes);
	// init
	updateSizes();
})(site.sizes);

(function(device){

	/* --- Mobile --- */
	device.support = Modernizr;

	/* --- Mobile --- */
	device.isMobile = device.support.touch;
	$html.addClass(device.isMobile ? 'd-mobile' : 'd-no-mobile');

	/* --- Retina --- */
	device.isRetina = (window.devicePixelRatio && window.devicePixelRatio>1);

	/* --- Phone --- */
	var phoneCheck = function(){
		device.isPhone = (site.sizes.width<768);
		$html.addClass(device.isPhone ? 'd-phone' : 'd-no-phone');
		$html.removeClass(device.isPhone ? 'd-no-phone' : 'd-phone');
	};
	$window.on('resize.phone-check', phoneCheck);
	phoneCheck();

	/* --- Flash --- */
	device.support.flash = swfobject.hasFlashPlayerVersion('8.0.0');
	$html.addClass(device.support.flash ? 'm-flash' : 'm-no-flash');

	/* --- iOS --- */
	if (navigator.userAgent.match(/iPad/i)) {
		$html.addClass('d-ipad');
		device.isIPad = true;
	};
	if (navigator.userAgent.match(/(iPhone|iPod touch)/i)) {
		$html.addClass('d-iphone');
		device.isIPhone = true;
	};
	if (navigator.userAgent.match(/(iPad|iPhone|iPod touch)/i)) {
		$html.addClass('d-ios');
		device.isIOS = true;
	};
	if (navigator.userAgent.match(/.*CPU.*OS 7_\d/i)) {
		$html.addClass('d-ios7');
		device.isIOS7 = true;
	};

	/* --- iPad (for fix wrong window height) --- */
	if ($html.hasClass('d-ipad d-ios7')) {
		$window.on('resize orientationchange focusout', function(){
			window.scrollTo(0,0);
		});
	};

	/* --- Firefox --- */
	device.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	$html.addClass(device.isFirefox ? 'd-firefox' : 'd-no-firefox');

	/* --- Save to cookies --- */
	for (option in device) {
		if (option.indexOf('is')===0) $.cookie(option, (device[option] ? 1 : 0), {expires: 1, path: '/'});
	};
	
	/* --- localStorage --- */
	if (typeof(Storage) !== "undefined"){
		device.isLocalStorage = true;
	}	
	
	clickEvent = (device.isMobile ? "touchend" : "click");

})(site.device);
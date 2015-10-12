/* --- Basic : plugin --- */
site.plugins.basic = function(){

	if (site.device.isMobile && !debug_mode){
		// Prevent default events
		//$document.on('touchmove MSPointerMove', function(e){
		//	e.preventDefault();
		//});
		//$window.on('mousewheel', function(e){
		//	e.preventDefault();
		//});
		//$document.on('dragstart selectstart', function() {
		//	return false;
		//});
		//$window.on('scroll', function(){
		//	$html.add($body).scrollTop(0);
		//});
	}
};

site.plugins['ui-help'] = function(params) {

	if (!(typeof params).match(/object/) || !params.block) return false;
	
	// blocks and vars
	if (!site.template.help) site.template.help = document.getElementById('ui-help-template').innerHTML;
	
	var $item = $(site.template.help), $parent;

	if (params.block == "modal") {
		$parent = $('<div class="YS__help__modal"></div>');
		
		if (params.keyboard) $item.addClass("YS__help--keyboard_" + params.keyboard);
		if (params.drag) $item.addClass("YS__help--drag_" + params.drag);
		if (params.direction) $item.addClass("YS__help_" + params.direction);
		if (params.text) $item.find(".YS__help__text_" + params.direction).html(params.text);
		
		$parent.append($item);
		$body.append($parent);
	}
	else {
		$parent = $(params.block);
		
		if (params.direction) $parent.addClass("YS__help_" + params.direction);
		
		$parent.append($item);
	}

	if (params.block == "modal"){
		setTimeout(function(){
			$parent.addClass("YS__help__modal--active");
			if (params.close > 0){
				setTimeout(function(){
					$parent.addClass("YS__help__modal--close").removeClass("YS__help__modal--active");
					setTimeout(function(){
						$parent.remove();
					}, 600);
				}, params.close);
			}
		}, 20);
	}
	
	if (params.keyboard == "only") return false;
	
	var $icon = $item.find('.YS__help__icon'),
	    $svg = $icon.find('svg'),
	    length = 16,
	    height = 50,
	    frame = { index:0 },
	    duration = 150,
	    dragTime = 700,
	    dragEasing = 'easeInOutCubic',
	    dragStyle = (params.direction=='horizontal') ? { left: '25%' } : { top: '20%' },
	    backStyle = (params.direction=='horizontal') ? { left: '75%' } : { top: '80%' },
	    active = (params.direction=='horizontal');

	// {fn} grab
	var grab = function(){
		active = true;
		frame.index = 0;
		sequence(length-1, drag);
	};
	// {fn} ungrab
	var ungrab = function(){
		frame.index = length-1;
		sequence(0, back);
	};
	// {fn} drag
	var drag = function(){
		$icon.delay(100).velocity(dragStyle, dragTime, dragEasing, ungrab);
	};
	// {fn} back
	var back = function(){
		$icon.delay(100).velocity(backStyle, dragTime, dragEasing, grab);
	};
	// {fn} sequence
	var sequence = function(to, callback){
		TweenLite.to(frame, duration/1000, {
			index: to,
			roundProps: 'index',
			ease: Linear.easeNone,
			delay: 0.1,
			onUpdate: function(){
				$svg[0].style.top = (-frame.index*height) + 'px';
			},
			onComplete: function(){
				if (callback) callback();
			}
		});
	};
	
	if (params.direction == 'horizontal') {
		grab();
	} else {
		if (!active) grab();
	};
	
};

site.plugins.scrollWithEmbeds = function(scroll){

	var $block = $(scroll.wrapper),
	    isScrolled = false,
	    grabTimer;

	// {event} resize
	$window.on('resize', function(){
		if ($block.css('position') != 'static') scroll.refresh();
	});

	var start = function(){
		clearTimeout(grabTimer);
		if (!isScrolled) {
			$block.addClass('i-scrolling');
			isScrolled = true;
		}
	};
	var end = function(){
		clearTimeout(grabTimer);
		if (isScrolled) {
			$block.removeClass('i-scrolling');
			isScrolled = false;
		}
	};

	scroll.on('grab', function(){
		start();
		grabTimer = setTimeout(function(){
			scroll.reset();
			end();
		}, 500);
	});

	scroll.on('scroll', function(){
		if (scroll.moved) start();
	});

	scroll.on('scrollEnd', function(){
		end();
	});

};

site.plugins.scrollable = function($block, light){

	// blocks and vars
	var scroll = new IScroll($block[0], {
		disableMouse: false,
		mouseWheel: true,
		scrollX: false,
		scrollY: true,
		click: false,
		tap: false,
		scrollbars: 'custom',
		interactiveScrollbars: !site.device.support.touch,
		probeType: 3
	});

	if (!site.device.isMobile){
		// attach plugins
		if (!light){
			site.plugins.keyboardScroll(scroll);
			site.plugins.scrollWithEmbeds(scroll);
		}
	}
	
	return scroll;
};

(function(plugins){

	var scrollIndex = 0;

	plugins.keyboardScroll = function(scroll){

		scrollIndex++;

		var eventName = 'keydown.keyboards-scroll-' + scrollIndex,
		    paused = false,
		    duration = 500;

		// scroll to
		var scrollTo = function(y){
			if (paused) return false;
			paused = true;
			scrollTimer = setTimeout(function(){
				paused = false;
			}, 50);
			scroll.scrollTo(0, y, duration, IScroll.utils.ease.cubicOut);
		};

		// slideUp
		var slideUp = function(){
			var y = Math.min(0, scroll.y + 100);
			scrollTo(y);
		};

		// slideDown
		var slideDown = function(){
			var y = Math.max(scroll.maxScrollY, scroll.y - 100);
			scrollTo(y);
		};

		// pageUp
		var pageUp = function(){
			var y = Math.min(0, scroll.y + scroll.wrapperHeight);
			scrollTo(y);
		};

		// pageDown
		var pageDown = function(){
			var y = Math.max(scroll.maxScrollY, scroll.y - scroll.wrapperHeight);
			scrollTo(y);
		};

		// Home
		var toHome = function(){
			scrollTo(0);
		};

		// End
		var toEnd = function(){
			scrollTo(scroll.maxScrollY);
		};

		// {fn} enable
		scroll.enableKeyboardScroll = function(){
			if (!site.device.support.touch) $document.on(eventName, function(e){
				if (e.which==38) slideUp();
				if (e.which==40) slideDown();
				if (e.which==33) pageUp();
				if (e.which==34) pageDown();
				if (e.which==36) toHome();
				if (e.which==35) toEnd();
			});
		};

		// {fn} disable
		scroll.disableKeyboardScroll = function(){
			if (!site.device.support.touch) $document.off(eventName);
		};

		// init
		if (scroll.enabled) scroll.enableKeyboardScroll();

		scroll.on('enable', function(){
			scroll.enableKeyboardScroll();
		});

		scroll.on('disable', function(){
			scroll.disableKeyboardScroll();
		});

	};

})(site.plugins);

site.plugins.flickity = function($block, params, callback){

	var flkties = [];

	$block.forEach(function(slider){
		var flkty;
		if (params){
			flkty = new Flickity(slider, params);
		}
		else {
			flkty = new Flickity(slider, {
				prevNextButtons: false,
				wrapAround: true,
				cellAlign: 'left',
				resize: true
			});		
		}
		
		flkties.push(flkty);
	});	
	
	var recalcFlickities = function() {
		for(var i = 0, len = flkties.length; i < len; ++i) {
			flkties[i].resize();
		}
	};
	
	if (callback && typeof callback === "function") callback(flkties);
};

site.plugins.isotope = function($block){

	site.ui.isotopeProducts = new Isotope( $block, {
		isResizeBound: false,
		itemSelector: '.product__item',
		percentPosition: true,
		masonry: {
			columnWidth: '.product__sizer'
		},
		transitionDuration: '0.75s'
	});
	
	site.plugins.isotope.resize = false;
	
	$window.off("resize.isotope");
	$window.on("resize.isotope", function(){
		if (!site.plugins.isotope.resize){
			site.plugins.isotope.resize = true;
			site.ui.containerProducts.addClass(site.settings.products.CS_review);
			setTimeout(function(){
				site.ui.isotopeProducts.layout();
			}, 20);
			setTimeout(function(){
				site.ui.containerProducts.removeClass(site.settings.products.CS_review);
				site.plugins.isotope.resize = false;
			}, 1200);
		}
	});
	
	site.ui.isotopeProducts.on('layoutComplete', function(){
		setTimeout(function(){
			site.ui.containerProducts.removeClass(site.settings.products.CS_review);
		}, 100);
	});
};

site.plugins.overlay = function(show, callback){

	if (show){
		if (site.ui.containerProduct){
			site.ui.containerProduct.addClass("product__preview--blur");
		}
		else {
			$root.addClass("page_overlay");
		}
	}
	else {
		if (site.ui.containerProduct){
			site.ui.containerProduct.removeClass("product__preview--blur");
		}
		else {
			$root.removeClass("page_overlay");
		}	
	}
};

site.plugins.spinner = function(item){

	site.template.init("spinner");
	
	item.append(site.template.spinner);
};

site.plugins.loading = function(show, callback){

	if (show){
		
		site.status("preloading", true);
		
		var overlay = false;
			
		if (!$root[0].className.match(/overlay/) && !$root[0].className.match(/lightOverlay/)){
			$root.addClass("page_lightOverlay");
			overlay = true;
		}
		
		site.template.init("loading");
		
		site.spinner = $(site.template.loading);

		$root.append(site.spinner);
		
		setTimeout(function(){
		
			site.spinner.addClass("YS__ui-loader--active");
			
			if (overlay && callback){
				$root.on(prefixed.transition + "end", function(){
					$root.off(prefixed.transition + "end");
					callback();
				});
			}
			else if (callback){
				setTimeout(function(){
					callback();
				}, 100);
			}
			
		}, 20);
	}
	else {
	
		if (site.spinner){
	
			site.spinner.removeClass("YS__ui-loader--active");
			
			setTimeout(function(){
				
				site.spinner.remove();
				
				site.spinner = false;
				
				if (callback) callback();
				
			}, 400);
		}
		
		site.status("preloading", false);
	}
};

site.plugins.onEndAnimation = function(elem, callback){

	if (!site.support){
		site.support = { animations : Modernizr.cssanimations },
		site.support.animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		site.support.animEndEventName = site.support.animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
	}
	var onEndCallbackFn = function(ev){
		if (site.support.animations){
			if (ev.target != this) return;
			this.removeEventListener(site.support.animEndEventName, onEndCallbackFn);
		}
		if (callback && typeof callback === 'function') {callback.call();}
	}
	if (site.support.animations){
		elem.addEventListener(site.support.animEndEventName, onEndCallbackFn);
	}
	else {
		onEndCallbackFn();
	}
};

site.plugins.frozeScroll = function(){

	var scroll = $document.scrollTop();
	
	$document.on("scroll.document", function(){
		$document.scrollTop(scroll);
	});
};

site.plugins.unFrozeScroll = function(){

	$document.off("scroll.document");
};

site.plugins.fixDragMove = function(container){

	if (site.device.isMobile){
	
		var touchstart;
		
		$(container).on("touchstart touchmove", function(e){
			var _this = this;
			if (e.type == "touchstart") touchstart = _this.style.WebkitTransform || _this.style.transform;
			else if (e.type == "touchmove") {
				$(e.target).on("touchend.disable", function(e){
					if (e.target !== _this && touchstart !== (_this.style.WebkitTransform || _this.style.transform)){
						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();
						$(e.target).off("touchend.disable");
					}
				});
			}
		});	
	}
	else {
	
		var mousedown, mouseup;

		$(container).on("mousedown mouseup", function(e){
		
			//$(".product__preview__products h3").append(e.type+", ");
		
			if (e.type == "mousedown") {mousedown = this.style.transform || this.style.WebkitTransform;}
			else if (e.type == "mouseup") {
			
				mouseup = this.style.transform || this.style.WebkitTransform;
				
				$(e.target).on("click.disable", function(e){
					if (mousedown !== mouseup){
						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();
						$(e.target).off("click.disable");
					}
				});
			}
		});
	}
};

site.plugins.fixDragMenu = function(container){

	if (site.device.isMobile){
	
		var touchstart, touchend;
		
		$(container).on("touchstart touchend", function(e){
			if (e.type == "touchstart") touchstart = this.style.WebkitTransform || this.style.transform;
			else if (e.type == "touchend") touchend = this.style.WebkitTransform || this.style.transform;
			if (touchstart !== touchend){
				site.plugins.fixDragMenu.action = true;
			}
			else {
				site.plugins.fixDragMenu.action = false;
			}
		});	
	}
	else {
	
		var mousedown, click;

		$(container).on("mousedown click", function(e){
		
			if (e.type == "mousedown") mousedown = this.style.transform || this.style.WebkitTransform;
			else if (e.type == "click") click = this.style.transform || this.style.WebkitTransform;
			if (mousedown !== click){
				site.plugins.fixDragMenu.action = true;
			}
			else {
				site.plugins.fixDragMenu.action = false;
			}
		});
	}
};

site.plugins.countLevelList = function(el, node, id){
	var count = 0;
	while (el !== undefined) {
		try {
			var elem = el.parentNode;
			
			if (elem.nodeName.toLowerCase() == node && elem.id != id){
				count++;
			}
			else if (elem.id == id){
				return count; break;
			}
			el = el.parentNode;
			
		} catch(e) {
			break;
		}
	}
};

site.plugins.findParent = function(el, cl){
	var elem="";
	cl = cl.replace(/^\.(.+)/, "$1");
	while (elem !== undefined) {
		try {
			var elem = el.parentNode;
			if (elem.getAttribute("class") && elem.getAttribute("class").match(cl)){
				return elem; break;
			}
			el = el.parentNode;
			
		} catch(e) {
			break;
		}
	}
};

site.plugins.convertPrice = function(text){

	if (text) return String(text).replace(/(\d)(?=((\d{3})+)(\D|$))/, "$1 ");
};

site.plugins.alertObj = function(obj){
	var str = ""; 
	for(k in obj) { 
		str += k+": "+ obj[k]+"\r\n"; 
	} 
	alert(str); 
};

site.plugins.reverseArray = function(array){

	   var arr = [];
	   
	   for (var i = array.length; i--;){
	       arr.push(array[i]);
	   }
	   
	   return arr;
};

site.plugins.rand = function(mi, ma){
	return Math.floor(Math.random() * (ma - mi + 1) + mi);
};

site.plugins.sbWidth = function(){
	if (window._sbWidth === undefined){
		var t = document.createElement('div');
		t.innerHTML = '<div style="height: 75px;">1<br>1</div>';
		t.style.overflowY = 'scroll';
		t.style.position = 'absolute';
		t.style.width = '50px';
		t.style.height = '50px';
		$body[0].appendChild(t);
		window._sbWidth = Math.max(0, t.offsetWidth - t.firstChild.offsetWidth - 1);
		$body[0].removeChild(t);
	}
	return window._sbWidth;
}

site.plugins.animElems = function(elems, effect){

    var element = $(elems);

    // Set default values for attrs
    var delay = 0.06;

    //Set defaul values for start animation and delay
    var start = Math.abs(delay);

    // Get all visible element and set opactiy to 0
	if (element[0].className.match(effect)){
		element.removeClass(effect);
	}
	else {
		element.addClass(effect);
	}

    // Add delay for each child elements
    element.each(function (i, elem) {
        start += delay;
        var rounded = Math.round(start * 10) / 10;
        $(elem).css('transition-delay', rounded + 's');
    }); 
}

site.plugins.translit = function(str) {

	var space = '-';
	var result = '';
	var transl = {
		'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
		'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
		'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
		'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': ' ',
		'ы': 'y', 'ь': ' ', 'э': 'e', 'ю': 'yu', 'я': 'ya'
	}
	
	if (str != '') str = str.toLowerCase();

	for (var i = 0; i < str.length; i++){
		if (/[а-яё]/.test(str.charAt(i))){
			result += transl[str.charAt(i)];
		} else if (/[a-z0-9]/.test(str.charAt(i))){
			result += str.charAt(i);
		} else {
			if (result.slice(-1) !== space) result += space;
		}
	}
	
	result = result.replace(/\s/g, "").replace(/-$/g, "");
	
	return result;
};

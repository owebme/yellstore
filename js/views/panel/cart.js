site.views.cart = (function(YS){

    return {
	
		init: function(){
			var _this = this;
			
			// Open Cart
			YS.ui.panel.cart.on(clickEvent, function(){
				if (!this.className.match(/active/)){
					YS.views.cart.open();
				}
				else {
					YS.views.cart.close();
				}
			});
			
			_this.build();
		},
		build: function(){
			var _this = this;
			
			if (!YS.template.cart) YS.template.cart = Handlebars.compile(document.getElementById(YS.settings.cart.template).innerHTML);
			
			var $YS_cart = $(YS.template.cart({path: YS.settings.products.path}));
			
			$root.append($YS_cart);
			
			// Scrolling Cart
			setTimeout(function(){
				$YS_cart.each(function(){
					var scroll = new IScroll(this, {
						mouseWheel: true
					});	
					scroll.on('grab', function(){
						$YS_cart.addClass("i-scrolling-grab");
					});
					scroll.on('scrollReset', function(){
						$YS_cart.removeClass("i-scrolling-grab");
					});
					//YS.plugins.fixDragMove(this.firstElementChild);
				});
			}, 100);			
			
			// Close Cart
			$YS_cart.find(".YS__m-cart__close").on(clickEvent, function(){
				_this.close();
			});			
			
			// Remove Cart Item
			$YS_cart.find(".YS__element_menu--close").on(clickEvent, function(){
				
				var $item = $(this).closest(".YS__m-cart__item");
				
				$item.addClass("YS__m-cart__item--remove");
				
				setTimeout(function(){
					$item.remove();
				}, 450);
			});
			
		},
		open: function(){
			var _this = this;
			
			YS.ui.panel.cart.addClass("YS__panel__cart--active");
			YS.ui.panel.self.addClass("YS__panel--active");			
			
			YS.plugins.overlay(true);
			
			YS.status("openCart", true);
				
			YS.plugins.frozeScroll();
		},
		close: function(){
			var _this = this;
			
			YS.ui.panel.cart.removeClass("YS__panel__cart--active");
			YS.ui.panel.self.removeClass("YS__panel--active");			
			
			YS.plugins.overlay(false);
			
			YS.status("openCart", false);
				
			YS.plugins.unFrozeScroll();
		},
		callback: function(){
			
		}
	};
	
})(site);
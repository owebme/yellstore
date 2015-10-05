site.views.products = (function(YS){

    return {
	
		init: function(){
			var _this = this;
			
			if (!YS.ui.productsLoading){
				YS.ui.productsLoading = $('<div class="product__item__loading"></div>');
				$body.append(YS.ui.productsLoading);
			}
			
			_this.components();
			
			$("."+YS.settings.products.CS_container).find("."+YS.settings.products.CS_openLink).on(clickEvent, function(e){
				e.preventDefault();
				YS.address.beforeProduct = YS.app.getUri();
				YS.app.productPage(this.getAttribute("data-item"), {action: "load", elem: this});
			});
			
		},
		components: function(){
		
			YS.views.productsFavorite($("."+YS.settings.products.CS_favorite));
			YS.views.productQuick.components.widgets();
		},
		library: function(){
		
			if (YS.settings.products.isotope) YS.plugins.isotope(document.querySelector("."+YS.settings.products.CS_container));
		},		
		load: function(category, callback, memorize){
			var _this = this;
			
			var loadingProducts = function(data){
				
				YS.ui.containerCategory = YS.models.products.prepare(data);
				
				$page_content.append(YS.ui.containerCategory);
				
				var gender = YS.models.products.getGender();
				
				if (YS.settings.products.isotope && !YS.device.isMobile){
				
					var item = 0, productsView = YS.models.products.getView();
					
					YS.ui.containerCategory.find("." + YS.settings.products.CS_product).each(function(){

						item++;
						
						var $elem = $(this), id = $elem.data("item");		
						
						if (item == 4 || item == 6 || item == 15 || item == 23 || item == 33){
						
							$elem.addClass(YS.settings.products.CS_product_large);
							
							if (productsView == "view1"){
								$elem.find("img").each(function(){
									this.setAttribute("data-lazy", YS.settings.products.path + (gender ? "/" + gender : "") + "/" + id + "_1.jpg");
									this.setAttribute("data-rollover", YS.settings.products.path + (gender ? "/" + gender : "") + "/" + id + "_2.jpg");
								});
							}
						
							if (item == 34) item = 0;
						}
					});
				}
				
				_this.lazyLoad(YS.settings.products.lazyLoad_limit);
				
				_this.init();
				
				if (callback && typeof callback === "function") callback();
			};			
			
			if (!memorize) {
				var data = YS.models.products.getProducts(category, 1, loadingProducts);
				if (!$body[0].className.match(/activeSearch/)) YS.storage.productsMemory = data;
			}
			else if (memorize && YS.storage.productsMemory) {
				loadingProducts(YS.storage.productsMemory);
			}
		},
		reload: function(category, callback, memorize){
			var _this = this;
			
			_this.scrollUp();
		
			$page_content.addClass(YS.settings.products.CS_reload);
			
			setTimeout(function(){
			
				$page_content.css("height", YS.ui.containerCategory.height() + "px");
				
				YS.ui.containerCategory.remove();
				
				_this.load(category, function(){
				
					_this.library();
					
					$page_content.removeClass(YS.settings.products.CS_reload);	
					
					YS.plugins.overlay(false);
					$root.removeClass("page_lightOverlay");

					YS.plugins.loading(false);

					$page_content.on(prefixed.transition + "end", function(){
						$page_content.off(prefixed.transition + "end");
						$page_content.css("height", "");
						if (callback && typeof callback === "function"){
							callback();
						}
					});
				
				}, memorize);
				
			}, 700);
		},
		scrollUp: function(){
		
			YS.plugins.unFrozeScroll();
			
			setTimeout(function(){
			
				var scroll = $body.scrollTop(),
					top = YS.ui.containerCategory.offset().top,
					duration = 0;
				
				if (scroll > top + 20){
				
					if (scroll > 800) duration = scroll * 0.2 + 640;
					else if (scroll < 400) duration = 400;
					
					scroll = top - 64;
					
					if ($body[0].className.match(/openSearch/)) {
						scroll = 0; if (duration < 600) duration = 600;
					}
					
					$body.animate({scrollTop: scroll}, duration);
				}
				
			}, 20);
		},
		lazyLoad: function(limit){
			var _this = this;
			
			if (!limit) limit = YS.settings.products.lazyLoad_limit;
		
			var count = 0, loaded = 0;
			
			YS.ui.containerCategory.find("." + YS.settings.products.CS_product_loadable).each(function(){
				var $item = $(this),
					$img = $item.find(".product__item__image"),
					id = this.getAttribute("data-item"),
					url = $img[0].getAttribute("data-lazy");
					
				if (url.match(/small/)) id += "_small";
					
				count++;
					
				if (count < limit + 1){
				
					$img[0].setAttribute("src", url);
				
					if (YS.models.products.cachedImages(id, url)) {
					
						$item.removeClass(YS.settings.products.CS_product_loadable);
					
						loaded++;
						
						if (loaded == limit){
							_this.scrollLoad(limit);
						}		
					}
					else {

						$img.load(function(){
						
							loaded++;
							
							$item.removeClass(YS.settings.products.CS_product_loadable);
							
							if (loaded == limit){
								_this.scrollLoad(limit);
							}
						});
					}
					
					if (!YS.device.isMobile && $item[0].className.match(/rollover/) && $img[0].getAttribute("data-rollover")){
					
						var $rollover = $('<img class="product__item__image product__item__image__rollover" src="'+ $img[0].getAttribute("data-rollover") +'">');
						$img.before($rollover);
					}
				}
			});
		},
		scrollLoad: function(limit){
			var _this = this,
				$loadable = YS.ui.containerCategory.find("." + YS.settings.products.CS_product_loadable + ":first");
			
			if ($loadable.length){
			
				var scroll = $loadable.offset().top;
				
				if (($document.scrollTop() + YS.sizes.height * 1.5) > scroll && scroll > 500){
					_this.lazyLoad(limit);
				}
				else {
					$document.on("scroll.load", function(){
						var scrollTop = $(this).scrollTop();
							
						if ((scrollTop + YS.sizes.height * 1.5) > scroll && scroll > 500){
							$document.off("scroll.load");
							_this.lazyLoad(limit);
						}
					});
				}
			}
		},
	};

})(site);
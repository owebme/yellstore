site.views.productQuick = (function(YS){

    return {
	
		init: function(container, data){
			var _this = this;
			
			if (!YS.ui.containerProduct) {
			
				YS.ui.containerProduct = container;
				
				// Help
				YS.views.productHelp.init();
				
				// Navigation
				YS.views.productNavigation.init();
				
				// Visited products
				YS.views.productVisited.init(data);		
			}
			
			// Open other products
			container.find("."+YS.settings.productQuick.CS_openLink_prod_recomend+", ."+YS.settings.productQuick.CS_openLink_prod_more).on(clickEvent, function(e){
				e.preventDefault();
				YS.app.productPage(this.getAttribute("data-item"), {action: "reload"});
			});
			
			// Close window product
			if (!YS.ui.closeProduct){
				YS.ui.closeProduct = $('<div class="'+ YS.settings.productQuick.CS_container_close +'"><div class="YS__element_menu YS__element_menu--close"><div class="YS__element_menu__close YS__element_menu__close--light"><div class="YS__element_menu__close_bg"></div></div></div></div>');
				$body.append(YS.ui.closeProduct);
				
				YS.ui.closeProduct.on(clickEvent, function(){
					YS.views.productQuick.close();
				});
			}	

			// Load library
			_this.library(container);
		},
		components: function(container){
			
			// Add Product in cart
			YS.views.productCart.init(container);	
			
			// Add Favorite self
			YS.views.productFavorite.init(container);	

			// Add Favorite more products
			YS.views.productsFavorite.init(container.find("."+YS.settings.productQuick.CS_products), YS.settings.productQuick.CS_favorite_products);

			// Add Shared Social
			YS.views.productSocial.init(container);
			
			// Open page links
			container.find(".YS__open__page_link").on(clickEvent, function(e){
				e.preventDefault();
				//container.addClass("product__preview--blur");
			});
			
		},
		library: function(container){
			var _this = this;
			
			var _selectedAttraction = 0.018,
				_friction = 0.18;
				
			if (YS.device.isMobile){
				_selectedAttraction = 0.025;
				_friction = 0.28;				
			}
			
			var params = {
				pageDots: false,
				wrapAround: true,
				cellAlign: 'left',
				resize: true,
				selectedAttraction: _selectedAttraction,
				friction: _friction
			}
			var callback = function(flkty){
				var $images = container.find(".product__preview__addimages");
				$images.on(clickEvent, ".product__preview__addimages__item", function() {
					$images.find(".product__preview__addimages__item--active").removeClass("product__preview__addimages__item--active");
					$(this).addClass("product__preview__addimages__item--active");
					flkty.select($(this).index());
				});
				flkty.on("cellSelect", function(){
					$images.find(".product__preview__addimages__item--active").removeClass("product__preview__addimages__item--active");
					$images.find(".product__preview__addimages__item:nth-child("+ (this.selectedIndex + 1) +")").addClass("product__preview__addimages__item--active");
				});
			};
			
			YS.plugins.flickity([].slice.call(container[0].querySelectorAll("."+YS.settings.productQuick.CS_item_slider)), params, callback);
			
			if (YS.settings.productQuick.flickity_products){
				YS.plugins.flickity([].slice.call(container[0].querySelectorAll("."+YS.settings.productQuick.CS_item_slider_products)));
			}
			
			if (YS.device.isMobile){
				if (_this.iscroll){
					_this.iscroll.refresh();
				}
				else {
					_this.iscroll = YS.plugins.scrollable(container);
					YS.plugins.fixDragMove(container[0].firstElementChild);
				}
			}
			else {
				_this.iscroll = container.children();
			}
			
		},		
		load: function(data, elem, callback){
			var _this = this, startWith = true, id;
			
			if ($body[0].className.match(/openProductLoading/)) return false;
			
			if (data && typeof data !== "object" && data.match(/\d+/)) id = data;
			
			YS.status("openProductLoading", true);
			
			if (elem) startWith = false;
			
			YS.plugins.frozeScroll();
			
			if (startWith){
				_this.readyLoading = true;
				_this.startLoading = false;
			}
			else {
				
				if (elem == "center"){
					var width = 236,
						height = 312;
				
					YS.ui.productsLoading.css({
						"top": (YS.sizes.height / 2) - (height / 2) + "px",
						"left": (YS.sizes.width / 2) - (width / 2) + "px",
						"width": width + "px",
						"height": height + "px"
					});			
				}
				else {
					var $elem = $(elem).closest("."+YS.settings.products.CS_product).find(".product__item__wrapper");
					
					YS.ui.productsLoading.css({
						"top": ($elem.offset().top - window.pageYOffset) + "px",
						"left": $elem.offset().left + "px",
						"width": $elem.width() + "px",
						"height": $elem.height() + "px"
					});
				}

				YS.plugins.spinner(YS.ui.productsLoading);
				
				_this.readyLoading = false;
				_this.startLoading = false;				
				
				setTimeout(function(){
					YS.ui.productsLoading.addClass("product__item__loading--active");
					YS.ui.productsLoading.on(prefixed.transition + "end", function(){
						YS.ui.productsLoading.off(prefixed.transition + "end");
						if (!_this.readyLoading){_this.readyLoading = true;}
					});
				}, 33);
			}
			
			var intervalTimer;
			
			YS.template.init("product", function(){
			
				intervalTimer = setInterval(function(){
				
					if (_this.readyLoading && !_this.startLoading){
					
						if (id){
							afterGetData(YS.models.product.getProduct(id));
						}
						else if (!id && data){
							afterGetData(data);
						}	
					}
					
				}, 100);
			});
			
			var afterGetData = function(data){

				clearInterval(intervalTimer);
				
				_this.startLoading = true;
			
				var container = YS.models.product.prepare(data);
				$body.append(container);
				
				if (startWith){
					_this.loadEnd(startWith, container, data, callback);
				}
				else {
					
					YS.ui.productsLoading.addClass("product__item__loading--zoom");
					
					if (YS.device.isMobile){
						_this.loadEnd(startWith, container, data, callback);
					}
					else {
						YS.ui.productsLoading.on(prefixed.transition + "end", function(){
							YS.ui.productsLoading.off(prefixed.transition + "end");
							_this.loadEnd(startWith, container, data, callback);
						});
					}
				}
			};			
			
		},
		loadEnd: function(startWith, container, data, callback){
			var _this = this;
		
			YS.status("openProductQuick", true);
			
			var marginLeft = 0;
	
			if (!startWith){
			
				if (YS.device.isMobile){
					YS.ui.productsLoading.css({
						"top":  "0",
						"left": "0",
						"width": "100%",
						"height": "100%"
					});							
				}
				else {
							
					var width = 1294;

					if (YS.sizes.width > 767 && YS.sizes.width < 1025){
						width = 959;
					}
					else if (YS.sizes.width > 1200 && YS.sizes.width < 1281){
						width = 1248;
					}
					else if (YS.sizes.width > 1399 && YS.sizes.width < 1499){
						width = 1368;
					}	
					else if (YS.sizes.width > 1499){
						width = 1468;
					}
					
					marginLeft = -(width/2) - 13;
				
					YS.ui.productsLoading.css({
						"top":  "0",
						"left": "50%",
						"width": width + "px",
						"height": YS.sizes.height + "px",
						"marginLeft": marginLeft + "px",
						"paddingLeft": "18px",
					});
				}
			}
			
			var finish = function(){
				
				// Initialization
				_this.init(container, data);
				
				var sbWidth = YS.plugins.sbWidth();
				
				if (YS.ui.productsLoading) YS.ui.productsLoading.addClass("product__item__loading--hide");
				container.addClass(YS.settings.productQuick.CS_container+"--active");							
				
				if (!YS.device.isMobile && !startWith){
					YS.ui.productsLoading[0].style.marginLeft = marginLeft -(sbWidth/2) + 'px';
				}
				YS.status("openProductQuick_active", true);
				
				container.find(".product__preview__wrapper").addClass("product__preview__wrapper--active");
				
				if (YS.ui.productsLoading) YS.ui.productsLoading.css("opacity", "0");
				
				container.on(prefixed.transition + "end", function(){
					container.off(prefixed.transition + "end");
					
					if (YS.ui.productsLoading){
						YS.ui.productsLoading[0].innerHTML="";
						YS.ui.productsLoading[0].className = "product__item__loading";
						YS.ui.productsLoading[0].setAttribute("style", "");	
					}
					_this.loading = $('<div class="product__preview__loading"></div>');
					container.append(_this.loading);
					
					YS.status("openProductLoading", false);
					
					setTimeout(function(){
					
						// Init's components
						_this.components(container);
						
						if (callback && typeof callback === "function") callback(data["alias"]);
					
					}, (!startWith ? 100 : 0));
				});
			};
			
			if (!YS.device.isMobile || YS.device.isMobile && startWith) YS.plugins.overlay(true);

			if (!startWith){
				YS.ui.productsLoading.on(prefixed.transition + "end", function(){
					YS.ui.productsLoading.off(prefixed.transition + "end");
					if (YS.device.isMobile) YS.plugins.overlay(true);
					setTimeout(function(){
						YS.loader.images(container.find(".image__preloading"), finish);
					}, 100);
				});
			}
			else {
				YS.loader.images(container.find(".image__preloading"), finish);
			}
		},
		reload: function(data, direction, callback){
			var _this = this, id;
			
			if ($body[0].className.match(/openProductLoading/)) return false;
			
			if (data && typeof data !== "object" && data.match(/\d+/)) id = data;
			
			YS.status("openProductLoading", true);
			
			if (YS.settings.productQuick.progress && !YS.device.isMobile) YS.loader.percent.init(_this.loading);
			
			var $wrapper = YS.ui.containerProduct.find(".product__preview__wrapper"),
				width = $wrapper.width() + 48;
			
			_this.loading.css({
				"width": width + "px",
				"marginLeft": -(width/2)-13 + "px",
				"paddingLeft": "18px",
			});
			
			if (!direction) direction = "left";
			
			YS.plugins.spinner(_this.loading);
			
			$wrapper.addClass("product__preview__wrapper--hide_" + direction);
			
			setTimeout(function(){
				_this.loading.addClass("product__preview__loading--zoom");
			}, 33);
			
			var intervalTimer; _this.endLoading = false;
			
			_this.loading.on(prefixed.transition + "end", function(){
				_this.loading.off(prefixed.transition + "end");
			
				_this.loading.css("z-index", "2");
				
				intervalTimer = setInterval(function(){
				
					if (!_this.endLoading){
				
						if (id){
							afterGetData(YS.models.product.getProduct(id));
						}
						else if (!id && data){
							afterGetData(data);
						}
					}
					
				}, 100);
				
				if (YS.device.isMobile){
					if (_this.iscroll) _this.iscroll.scrollTo(0, 0, 0, IScroll.utils.ease.cubicOut);
				}
				else {
					_this.iscroll.scrollTop(0);
				}
			});
			
			var afterGetData = function(data){
			
				clearInterval(intervalTimer);
				
				_this.endLoading = true;
			
				var $render = YS.models.product.prepare(data),
					tpl = $render[0].firstElementChild.innerHTML;
				
				YS.ui.containerProduct[0].firstElementChild.innerHTML = tpl;
				YS.views.productVisited.add(data);
				
				YS.loader.images(YS.ui.containerProduct.find(".image__preloading"), function(){
				
					YS.ui.containerProduct[0].setAttribute("data-item", data["id"]);
				
					// Initialization
					_this.init(YS.ui.containerProduct);
					
					YS.ui.containerProduct.find(".product__preview__wrapper").addClass("product__preview__wrapper--active");
					
					_this.loading.addClass("product__preview__loading--hide");
					
					_this.loading.on(prefixed.transition + "end", function(){
						_this.loading.off(prefixed.transition + "end");
						_this.loading.attr("class", "offTransition product__preview__loading").attr("style", "").empty();
						
						YS.status("openProductLoading", false);
						
						setTimeout(function(){
							_this.loading.removeClass("offTransition");
						}, 20);
						
						// Init's components
						_this.components(YS.ui.containerProduct);						
						
						if (callback && typeof callback === "function") callback(data["alias"]);
					});
					
				}, YS.loader.percent.progress);				
			}
			
		},
		close: function(arrow){
			var _this = this;
		
			if (!YS.ui.containerProduct) YS.ui.containerProduct = $("."+YS.settings.productQuick.CS_container);
			
			if (YS.device.isMobile) {
				YS.ui.containerProduct.remove();
			}
			else {
				var $container = YS.ui.containerProduct;
				if (arrow == "down"){
					$container.addClass(YS.settings.productQuick.CS_container + "--hide_" + arrow);
				}
				else {
					$container.addClass(YS.settings.productQuick.CS_container + "--hide");
				}
				_this.iscroll[0].style.overflow = "hidden";
			}
			
			YS.ui.containerProduct = false;
			_this.iscroll = false;
			
			YS.plugins.overlay(false);
			
			if (YS.device.isFirefox) $root[0].style.background = "#6b656f";
			
			YS.status("openProductQuick_active", false);
			YS.status("openProductQuick", false);
			YS.status("openProductLoading", false);
			
			if (YS.device.isFirefox) {
				setTimeout(function(){
					$root[0].setAttribute("style", "");
				}, 20);
			}
			
			if (YS.ui.containerVisited){
				YS.ui.containerVisited.removeClass("product__preview__visited--active");
			}
			
			if (YS.device.isMobile) {
				_this.exit();
			}
			else {
				$root.on(prefixed.transition + "end", function(){
					$root.off(prefixed.transition + "end");
					
					setTimeout(function(){
					
						$container.remove();
						
						_this.exit();
						
					}, 100);
				});
			}
		},
		exit: function(){
		
			if (YS.ui.containerVisited){
				YS.views.productVisited.add();
			}
			if (YS.address.beforeProduct) {
				if (YS.address.beforeProduct == YS.app.getUri()){
					YS.app.setUri();
				}
				else {
					YS.app.setUri(YS.address.beforeProduct);
				}
			}
			else {
				YS.app.setUri();
			}
			
			YS.views.productsFavorite.observer();
			
			$body.off("keyup.productQuick");
			YS.plugins.unFrozeScroll();
		}
	}

})(site);
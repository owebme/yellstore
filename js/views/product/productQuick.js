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
			container.find("."+YS.settings.productQuick.CS_openLink_products).on(clickEvent, function(e){
				e.preventDefault();
				YS.app.productPage({id: this.getAttribute("data-item"), action: "reload"});
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
			
			// Add Product gallery more products
			YS.views.productsGalleryTwirl.init(container.find(".productt__item"), YS.settings.productQuick.CS_gallery_products);			

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
			
			// Flickity for self product
			YS.plugins.flickity([].slice.call(container[0].querySelectorAll("."+YS.settings.productQuick.CS_item_slider)), {
				pageDots: false,
				wrapAround: true,
				cellAlign: 'left',
				resize: true,
				selectedAttraction: _selectedAttraction,
				friction: _friction			
			
			}, function(flkties){
				var $images = container.find(".product__preview__addimages"),
					flkty = flkties[0];
				$images.on(clickEvent, ".product__preview__addimages__item", function() {
					$images.find(".product__preview__addimages__item--active").removeClass("product__preview__addimages__item--active");
					$(this).addClass("product__preview__addimages__item--active");
					flkty.select($(this).index());
				});
				flkty.on("cellSelect", function(){
					$images.find(".product__preview__addimages__item--active").removeClass("product__preview__addimages__item--active");
					$images.find(".product__preview__addimages__item:nth-child("+ (this.selectedIndex + 1) +")").addClass("product__preview__addimages__item--active");
				});
			});
			
			// Flickity for products more
			if (YS.settings.productQuick.flickity_products && !YS.device.isMobile){
				YS.plugins.flickity([].slice.call(container[0].querySelectorAll("."+YS.settings.productQuick.CS_item_slider_products)), {
					prevNextButtons: true,
					wrapAround: true,
					cellAlign: 'left',
					resize: false
					
				}, function(flkties){
					if (YS.settings.productQuick.CS_theme_prod_recomend == "twirl" || YS.settings.productQuick.CS_theme_prod_more == "twirl"){
						for (var i = 0, flkty; flkty = flkties[i++];) {
							flkty.select(1);
						}
					}
				});
			}
			
			// Init scroll content
			if (YS.device.isMobile){
				if (_this.iscroll){
					_this.iscroll.refresh();
				}
				else {
					_this.iscroll = YS.plugins.scrollable(container);
				}
			}
			else {
				_this.iscroll = container.children();
			}
			
		},		
		load: function(data, elem, callback){
			var _this = this, startWith = false, id, slipMove = false;
			
			if ($body[0].className.match(/openProductLoading/)) return false;
			
			if (data && typeof data !== "object" && data.match(/\d+/)) id = data;
			
			YS.status("openProductLoading", true);
			
			if (!elem) startWith = true;
			
			if (YS.device.isMobile) elem = "slipCenter";
			
			YS.plugins.frozeScroll();
			
			if (startWith){
				_this.readyLoading = true;
				_this.startLoading = false;
			}
			else {
				_this.readyLoading = false;
				_this.startLoading = false;
				
				YS.plugins.spinner(YS.ui.productsLoading);
				
				if (typeof elem === "string" && elem.match(/slip/)){
				
					slipMove = elem;
				
					if (YS.device.isMobile){
						YS.status("openProductQuick", true);
					}
					else {
						YS.ui.productsLoading.css(_this.getSizeLoading());
						YS.ui.productsLoading.addClass("product__item__loading--" + slipMove);
					}
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
				
				setTimeout(function(){
					YS.ui.productsLoading.addClass("product__item__loading--active");
					if (YS.device.isMobile) YS.plugins.overlay(true);
					YS.ui.productsLoading.on(prefixed.transition + "end", function(){
						YS.ui.productsLoading.off(prefixed.transition + "end");
						if (!_this.readyLoading){_this.readyLoading = true;}
					});
				}, (YS.device.isMobile ? 0 : 33));
			}
			
			var intervalTimer;
			
			YS.template.init("product", function(){
			
				if (id){
					intervalTimer = setInterval(function(){
						if (_this.readyLoading && !_this.startLoading){
							afterGetData(YS.models.product.getProduct(id));
						}
					}, 100);
				}
				else if (!id && data){
					afterGetData(data);
				}
				
			});
			
			var afterGetData = function(data){

				if (data){

					clearInterval(intervalTimer);
					
					_this.startLoading = true;
				
					var container = YS.models.product.prepare(data);
					$body.append(container);
					
					if (startWith || slipMove){
						_this.loadEnd(startWith, container, data, slipMove, callback);
					}
					else {
						
						YS.ui.productsLoading.addClass("product__item__loading--zoom");
						
						YS.ui.productsLoading.on(prefixed.transition + "end", function(){
							YS.ui.productsLoading.off(prefixed.transition + "end");
							_this.loadEnd(startWith, container, data, slipMove, callback);
						});
					}
				}
			};
		},
		loadEnd: function(startWith, container, data, slipMove, callback){
			var _this = this;
		
			YS.status("openProductQuick", true);
			
			var marginLeft = 0,
				sizeLoading = _this.getSizeLoading();

			if (!startWith && !slipMove){
				
				marginLeft = parseInt(sizeLoading.marginLeft);
			
				YS.ui.productsLoading.css(sizeLoading);
			}
			else if (slipMove && !YS.device.isMobile){
				marginLeft = parseInt(YS.ui.productsLoading[0].style.marginLeft);
			}
			
			var finish = function(){
				
				// Initialization
				_this.init(container, data);
				
				var sbWidth = YS.plugins.sbWidth();
				
				if (YS.ui.productsLoading) YS.ui.productsLoading.addClass("product__item__loading--hide");
				container.addClass(YS.settings.productQuick.CS_container+"--active");							
				
				if (!YS.device.isMobile && !startWith && sbWidth > 0){
					YS.ui.productsLoading[0].style.marginLeft = marginLeft -(sbWidth/2) + 'px';
				}
				YS.status("openProductQuick_active", true);
				
				container.find(".product__preview__wrapper").addClass("product__preview__wrapper--active");
				
				if (YS.ui.productsLoading) YS.ui.productsLoading.css("opacity", "0");
				
				container.on(prefixed.transition + "end", function(){
					container.off(prefixed.transition + "end");
					
					if (YS.ui.productsLoading){
						YS.ui.productsLoading[0].innerHTML = "";
						YS.ui.productsLoading[0].setAttribute("style", "");	
						if (YS.device.isMobile){
							YS.ui.productsLoading[0].className = "product__item__loading product__item__loading--" + slipMove;
						}
						else {
							YS.ui.productsLoading[0].className = "product__item__loading";
						}
					}
					_this.loading = $('<div class="product__preview__loading"></div>');
					
					if (!YS.device.isMobile){
					
						var width = parseInt(sizeLoading.width);
						
						_this.loading.css({
							"width": width + "px",
							"marginLeft": -(width/2)-21 + "px",
							"paddingLeft": "18px",
						});
					}
					
					container.append(_this.loading);
					
					YS.status("openProductLoading", false);
					
					setTimeout(function(){
					
						// Init's components
						_this.components(container);
						
						if (callback && typeof callback === "function") callback(data["alias"]);
					
					}, (!startWith ? 100 : 0));
				});
			};
			
			if (!slipMove) YS.plugins.overlay(true);

			if (!startWith && !slipMove){
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
		getSizeLoading: function(){
		
			var width = 1294,
				winWidth = YS.sizes.width;

			if (winWidth > 767 && winWidth < 1025){
				width = 959;
			}
			else if (winWidth > 1200 && winWidth < 1281){
				width = 1248;
			}
			else if (winWidth > 1399 && winWidth < 1499){
				width = 1368;
			}	
			else if (winWidth > 1499){
				width = 1468;
			}
		
			var result = {
				"top":  "0",
				"left": "50%",
				"width": width + "px",
				"height": "100%",
				"marginLeft": (-(width/2) - 13) + "px",
				"paddingLeft": "18px",
			};	

			return result;
			
		},		
		reload: function(data, direction, callback){
			var _this = this, id;
			
			if ($body[0].className.match(/openProductLoading/)) return false;
			
			if (data && typeof data !== "object" && data.match(/\d+/)) id = data;
			
			YS.status("openProductLoading", true);
			
			if (YS.settings.productQuick.progress && !YS.device.isMobile) YS.loader.percent.init(_this.loading);
			
			var $wrapper = YS.ui.containerProduct.find(".product__preview__wrapper");
			
			YS.plugins.spinner(_this.loading);
			
			if (!direction) direction = "left";
			
			if (YS.device.isMobile){
				_this.loading.addClass("product__preview__loading--zoom");
				$wrapper.addClass("product__preview__wrapper--hide_" + direction);
			}
			else {
				$wrapper.addClass("product__preview__wrapper--hide_" + direction);
				setTimeout(function(){
					_this.loading.addClass("product__preview__loading--zoom");
				}, 33);				
			}
			
			var intervalTimer; _this.endLoading = false;
			
			_this.loading.on(prefixed.transition + "end", function(){
				_this.loading.off(prefixed.transition + "end");
				_this.loading.css("z-index", "2");
				
				if (id){
					intervalTimer = setInterval(function(){
						if (!_this.endLoading){
							afterGetData(YS.models.product.getProduct(id));
						}
					}, 100);
				}
				else if (!id && data){
					afterGetData(data);
				}
				
				if (YS.device.isMobile){
					if (_this.iscroll) _this.iscroll.scrollTo(0, 0, 0, IScroll.utils.ease.cubicOut);
				}
				else {
					_this.iscroll.scrollTop(0);
				}
			});
			
			var afterGetData = function(data){
			
				if (data){
			
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
							
							_this.loading[0].innerHTML = "";
							_this.loading[0].className = "offTransition product__preview__loading";
							_this.loading[0].style.zIndex = "";
							
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
				if (_this.iscroll) _this.iscroll[0].style.overflow = "hidden";
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
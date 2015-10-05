site.views.productQuick = (function(YS){

    return {
	
		init: function(container){
			var _this = this;
			
			YS.ui.containerProduct = container;
		
			// Add Product in cart
			_this.components.cart(container);
			
			// Add Favorite self
			_this.components.favorite(container);			

			// Add Favorite more products
			YS.views.productsFavorite(container.find("."+YS.settings.productQuick.CS_favorite_products));			
			
			// Open other products
			container.find("."+YS.settings.productQuick.CS_openLink_prod_recomend+", ."+YS.settings.productQuick.CS_openLink_prod_more).on(clickEvent, function(e){
				e.preventDefault();
				YS.app.productPage(this.getAttribute("data-item"), {action: "reload"}, container);
			});
			
			// Shared Social
			container.find(".product__preview__desc__social__item").on(clickEvent, function(){
				_this.components.social(this.getAttribute("data-social"));
			});
			
			// Open page links
			container.find(".YS__open__page_link").on(clickEvent, function(e){
				e.preventDefault();
				//container.addClass("product__preview--blur");
			});
		},
		components: {
			help: function(delay){
			
				if (!delay) delay = 1500;
				
				if (!$.cookie('YS__help__products_nav')){
					setTimeout(function(){
						if (YS.device.isMobile){
							YS.plugins['ui-help']({
								block: "modal",
								drag: "only",
								direction: "horizontal",
								text: "Перетаскивайте слайды горизонтально<br /> для навигации по соседним товарам",
								close: 3500
							});							
						}
						else {
							YS.plugins['ui-help']({
								block: "modal",
								keyboard: "only",
								direction: "horizontal",
								text: "Используйте клавиши на клавиатуре<br /> для навигации по соседним товарам",
								close: 2500
							});
						}
						$.cookie('YS__help__products_nav', 1, {expires: 30, path: '/'})
					}, delay);
				}
			},
			nav: function(){
				var _this = YS.views.productQuick;
				
				var startPress = true;

				if (!YS.device.isMobile){
					$body.on("keyup.productQuick", function(e){
						if (!YS.ui.containerProduct[0].className.match(/blur/)){

							// Next product
							if (e.which == "39"){
								if (startPress){
									startPress = false;
									YS.app.productPage("random", {action: "reload", direction: "left"}, YS.ui.containerProduct);
									setTimeout(function(){
										startPress = true;
									}, (YS.device.isFirefox ? 2000 : 1000));
								}
							}
							// Prev product
							if (e.which == "37"){
								if (startPress){
									startPress = false;
									YS.app.productPage("random", {action: "reload", direction: "right"}, YS.ui.containerProduct);
									setTimeout(function(){
										startPress = true;
									}, (YS.device.isFirefox ? 2000 : 1000));
								}
							}
							// Close (key esc)
							if (e.which == "27"){
								_this.close();
							}
						}
					});
				}
			},
			visited: function(data, params){
				var _this = this;
				
				// Loading products visited
				if (params == "load" && YS.settings.productQuick.visited_limit){
				
					if (!YS.ui.containerVisited){
				
						YS.ui.containerVisited = $('<div class="product__preview__visited"></div>');
						YS.ui.containerVisited_open = $('<div class="product__preview__visited__item__open">Посмотреть все<br><span>...</span></div>');
						YS.ui.containerVisited.append(YS.ui.containerVisited_open);
						$body.append(YS.ui.containerVisited);
					
						// Loading products visited out memory
						if (!YS.storage.productsVisited && YS.settings.productQuick.visited_memory){
							YS.storage.productsVisited = YS.models.product.getVisited();
						}
						if (YS.storage.productsVisited){
						
							var start = YS.storage.productsVisited.length - YS.settings.productQuick.visited_limit;
							
							if (YS.settings.productQuick.visited_limit >= YS.storage.productsVisited.length) start = 0;
						
							for (var i = start, item; item = YS.storage.productsVisited[i++];) {
								YS.ui.containerVisited_open.before('<div data-item="'+ item['id'] +'" class="product__preview__visited__item'+ (i == YS.storage.productsVisited.length?' product__preview__visited__item--last':'') +'"><img class="product__preview__visited__item__image" src="'+ YS.settings.products.path + (item['gender'] ? '/' + item['gender'] : '') + '/lite/'+ item['img'] +'_lite.jpg"></div>');
							}
							
							if (YS.storage.productsVisited.length > YS.settings.productQuick.visited_limit){
								YS.ui.containerVisited_open.addClass("product__preview__visited__item__open--active");
							}
							
							// Open product visited
							_this.visitedClick(YS.ui.containerVisited.find(".product__preview__visited__item"));
						}
						else {
							YS.storage.productsVisited = [];
						}
						
						// Open modal products visited
						if (!YS.device.isMobile){
							YS.ui.containerVisited_open.on("click", function(e){
								e.preventDefault();
								_this.visitedOpen();
							});
						}
					}
					
					if (!YS.ui.containerVisited[0].className.match(/active/)){
						setTimeout(function(){
							YS.ui.containerVisited.addClass("product__preview__visited--active");
						}, 5);
					}
				}
				
				// Add product visited
				if (params == "add" && YS.storage.lastProductVisited && YS.settings.productQuick.visited_limit){
				
					var notDouble = true;
					
					for (var i = 0, item; item = YS.storage.productsVisited[i++];) {
						if (YS.storage.lastProductVisited["id"] == item['id']) notDouble = false;
					}
					
					if (notDouble){
				
						var counts = YS.storage.productsVisited.length;
						
						if (counts < 12){
							YS.storage.productsVisited.push(YS.storage.lastProductVisited);
						}
						else {
							YS.storage.productsVisited = _.rest(YS.storage.productsVisited);
							YS.storage.productsVisited.push(YS.storage.lastProductVisited);
						}
						// Save products visited
						if (YS.settings.productQuick.visited_memory){
							YS.models.product.setVisited(YS.storage.productsVisited);
						}
						if (counts >= YS.settings.productQuick.visited_limit){
							YS.ui.containerVisited.find(".product__preview__visited__item:first").remove();
						}
						
						var $item = $('<div data-item="'+ YS.storage.lastProductVisited['id'] +'" class="product__preview__visited__item product__preview__visited__item--last"><img class="product__preview__visited__item__image" src="'+ YS.settings.products.path + (YS.storage.lastProductVisited['gender'] ? '/' + YS.storage.lastProductVisited['gender'] : '') + '/lite/'+ YS.storage.lastProductVisited['img'] +'_lite.jpg"></div>');
						YS.ui.containerVisited.find(".product__preview__visited__item--last").removeClass("product__preview__visited__item--last");
						YS.ui.containerVisited_open.before($item);
						
						if (counts == YS.settings.productQuick.visited_limit && !YS.ui.containerVisited_open[0].className.match(/active/)){
							YS.ui.containerVisited_open.addClass("product__preview__visited__item__open--active");
						}
						
						// Open product visited (current product)
						_this.visitedClick($item);
					}
				}
				
				// Save last product visited
				if (data){
					YS.storage.lastProductVisited = {
						id: data["id"],
						gender: data["gender"],
						img: data[YS.settings.productQuick.img_lite],
						price: String(data["price"]).replace(/\s/g, "")
					};
				}
			},
			visitedClick: function(items){
				var _this = this;
				
				items.on(clickEvent, function(e){
					e.preventDefault();
					if (YS.device.isMobile){
						_this.visitedOpen();
					}
					else {
						YS.app.productPage(this.getAttribute("data-item"), {action: "reload"}, YS.ui.containerProduct);
					}
				});
			},
			visitedOpen: function(){
				var _this = this;
				
				var openCallback = function(){
					YS.ui.containerVisited.removeClass("product__preview__visited--active");
					
					YS.ui.productsModal.find(".YS__m-products__item").on(clickEvent, function(){
						var elem = this;
						
						YS.views.productsModal.close(closeCallback);
						
						setTimeout(function(){
							YS.app.productPage(elem.getAttribute("data-item"), {action: "reload"}, YS.ui.containerProduct);
						}, 50);
					});
				},
				closeCallback = function(){
					YS.ui.productsModal.on(prefixed.transition + "end", function(){
						YS.ui.productsModal.off(prefixed.transition + "end");
						YS.ui.containerVisited.addClass("product__preview__visited--active");
					});
				};			
					
				YS.views.productsModal.open(
					'Недавно просмотренные товары',
					YS.plugins.reverseArray(YS.storage.productsVisited),
					openCallback,
					closeCallback
				);
			},		
			widgets: function(){
				var _this = this;
			
				if (!YS.ui.productWidgets){
					YS.ui.productWidgets = $('<div class="product__widgets"></div>');
					YS.ui.productWidgetsFavorite = $('<div class="product__widgets__button product__widgets__button__favorite"><i class="product__widgets__button__icon product__widgets__button__favorite__icon fa fa-star-o"></i></div>');
					YS.ui.productWidgetsFavoriteCount = $('<span class="product__widgets__button__count product__widgets__button__favorite__count">0</span>');
					YS.ui.productWidgetsCart = $('<div class="product__widgets__button product__widgets__button__cart"><i class="product__widgets__button__icon product__widgets__button__cart__icon fa fa-shopping-cart"></i></div>');
					YS.ui.productWidgetsCartCount = $('<span class="product__widgets__button__count product__widgets__button__cart__count">0</span>');
					YS.ui.productWidgetsFaq = $('<div class="product__widgets__button product__widgets__button__faq"></div>');
					YS.ui.productWidgetsFaq.append('<i class="product__widgets__button__icon product__widgets__button__faq__icon fa fa-question"></i>');
					YS.ui.productWidgetsExit = $('<div class="product__widgets__exit"></div>');
					$body.append(YS.ui.productWidgets);
					YS.ui.productWidgets.append(YS.ui.productWidgetsFavorite);
					YS.ui.productWidgets.append(YS.ui.productWidgetsCart);
					YS.ui.productWidgets.append(YS.ui.productWidgetsFaq);
					YS.ui.productWidgets.append(YS.ui.productWidgetsExit);
					YS.ui.productWidgetsFavorite.append(YS.ui.productWidgetsFavoriteCount);
					YS.ui.productWidgetsCart.append(YS.ui.productWidgetsCartCount);
					
					var openCallback = function(){
						YS.ui.productWidgetsFaq.addClass("product__widgets__button--active");
						YS.ui.productWidgets.addClass("product__widgets--active");
					}
					var closeCallback = function(){
						YS.ui.productWidgets.removeClass("product__widgets--active");
						YS.ui.productWidgetsFaq.removeClass("product__widgets__button--active");					
					}		
					
					// Open Modal Faq
					YS.ui.productWidgetsFaq.on(clickEvent, function(){
						if (!this.className.match(/active/)){
							YS.app.faqPage("open", openCallback, closeCallback);
						}
						else {
							YS.app.faqPage("close", openCallback, closeCallback);
						}
					});

					// Arrow Down (exit)
					YS.ui.productWidgetsExit.on(clickEvent, function(){
						YS.views.productQuick.close("down");
					});
				}
			},
			cart: function(container){
				var _this = this;
				
				container.find("."+YS.settings.productQuick.CS_addCart).on(clickEvent, function(e){
					var elem = this, count = 0;
					e.preventDefault();
					if (elem.className.match(/active/)){
						$(elem).removeClass("YS__element__btn--active").text("Вы убрали из корзины :(");
						count--;
					}
					else {
						$(elem).addClass("YS__element__btn--active").text("Уже в вашей корзине");
						count++;
					}
					_this.cartAnimate(count);
				});
			},
			cartAnimate: function(count){
			
				count = parseInt(YS.ui.productWidgetsCartCount[0].innerHTML) + count;
			
				YS.ui.productWidgetsCart.addClass("product__widgets__button--animate");
				
				YS.plugins.onEndAnimation(YS.ui.productWidgetsCart[0].firstElementChild, function() {
					YS.ui.productWidgetsCart.removeClass("product__widgets__button--animate");
					if (count > 0){
						YS.ui.productWidgetsCart.addClass("product__widgets__button__cart--active");
					}
					else {
						YS.ui.productWidgetsCart.removeClass("product__widgets__button__cart--active");
					}
				});
				
				setTimeout(function(){
					YS.ui.productWidgetsCartCount[0].innerHTML = count;
				}, 200);
			},
			favorite: function(container){
				var _this = this;
				
				container.find("."+YS.settings.productQuick.CS_addFavorite).on(clickEvent, function(e){
					var elem = this, count = 0;
					e.preventDefault();
					if (elem.className.match(/active/)){
						$(elem).removeClass("product__preview__desc__favorite--active");
						$(elem).find(".product__preview__desc__favorite__label").text("Добавить в избранные");
						count--;
					}
					else {
						$(elem).addClass("product__preview__desc__favorite--active");
						$(elem).find(".product__preview__desc__favorite__label").text("Товар уже в избранном");
						count++;
					}
					_this.favoriteAnimate(count);
				});
			},
			favoriteAnimate: function(count){
			
				count = parseInt(YS.ui.productWidgetsFavoriteCount[0].innerHTML) + count;
				
				YS.ui.productWidgetsFavorite.addClass("product__widgets__button--animate");
				
				YS.plugins.onEndAnimation(YS.ui.productWidgetsFavorite[0].firstElementChild, function() {
					YS.ui.productWidgetsFavorite.removeClass("product__widgets__button--animate");
					if (count > 0){
						YS.ui.productWidgetsFavorite.addClass("product__widgets__button__favorite--active");
					}
					else {
						YS.ui.productWidgetsFavorite.removeClass("product__widgets__button__favorite--active");
					}
				});	

				setTimeout(function(){
					YS.ui.productWidgetsFavoriteCount[0].innerHTML = count;
				}, 200);				
			},
			popup: function(elem){
			
				
			},			
			social: function(soc){
				var link="",
				text = document.title,
				address = window.location.href;
				if (soc == "fb"){link = 'https://www.facebook.com/sharer/sharer.php?u='+address+'?utm_source=social_fb';}
				else if (soc == "vk"){link = 'http://vk.com/share.php?url='+address+'?utm_source=social_vk';}
				else if (soc == "dk"){link = 'http://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl='+address+'?utm_source=social_dk&st.comments='+encodeURIComponent(text);}
				else if (soc == "tw"){link = 'https://twitter.com/intent/tweet?original_referer='+address+'&text='+encodeURIComponent(text)+'&url='+address+'?utm_source=social_tw';}
				window.open(link,"displayWindow","width=520,height=300,left=350,top=170,status=no,toolbar=no,menubar=no");	
			},
			close: function(){
				if (!YS.ui.closeProduct){
					YS.ui.closeProduct = $('<div class="'+ YS.settings.productQuick.CS_container_close +'"><div class="YS__element_menu YS__element_menu--close"><div class="YS__element_menu__close YS__element_menu__close--light"><div class="YS__element_menu__close_bg"></div></div></div></div>');
					$body.append(YS.ui.closeProduct);
					
					YS.ui.closeProduct.on(clickEvent, function(){
						YS.views.productQuick.close();
					});
				}
			}
		},
		library: function(container){
			var _this = this;
			
			var params = {
				pageDots: false,
				wrapAround: true,
				cellAlign: 'left',
				resize: true,
				selectedAttraction: 0.018,
				friction:0.18
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
				var $elem = $(elem).closest("."+YS.settings.products.CS_product).find(".product__item__wrapper");
				
				YS.ui.productsLoading.css({
					"top": $elem.offset().top + "px",
					"left": $elem.offset().left + "px",
					"width": $elem.width() + "px",
					"height": $elem.height() + "px"
				});

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
					
						if (!id && data){
							afterGetData(data);
						}					
						else if (id && YS.models.product.hasCached(id)){
							afterGetData(YS.models.product.getCached(id));
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
					YS.ui.productsLoading.on(prefixed.transition + "end", function(){
						YS.ui.productsLoading.off(prefixed.transition + "end");
						_this.loadEnd(startWith, container, data, callback);
					});
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
						"top":  "50%",
						"left": "50%",
						"width": width + "px",
						"height": YS.sizes.height + "px",
						"marginTop": -((YS.sizes.height/2) - $window.scrollTop()) + "px",
						"marginLeft": marginLeft + "px",
						"paddingLeft": "18px",
					});
				}
			}
			
			var finish = function(){
				
				_this.init(container);
				_this.library(container);
				_this.components.visited(data, "load");
				YS.template.init("productsModal");
				
				var sbWidth = YS.plugins.sbWidth();
				
				if (YS.ui.productsLoading) YS.ui.productsLoading.addClass("product__item__loading--hide");
				container.addClass(YS.settings.productQuick.CS_container+"--active");							
				
				if (!YS.device.isMobile && !startWith){
					YS.ui.productsLoading[0].style.marginLeft = marginLeft -(sbWidth/2) + 'px';
				}
				YS.status("openProductQuick_active", true);
				
				container.find(".product__preview__wrapper").addClass("product__preview__wrapper--active");
				
				if (YS.ui.productsLoading) YS.ui.productsLoading.css("opacity", "0");
				
				setTimeout(function(){
					
					if (YS.ui.productsLoading){
						YS.ui.productsLoading[0].innerHTML="";
						YS.ui.productsLoading[0].className = "product__item__loading";
						YS.ui.productsLoading[0].setAttribute("style", "");	
					}
					_this.loading = $('<div class="product__preview__loading"></div>');
					container.append(_this.loading);
					
					YS.status("openProductLoading", false);
					
					// Help
					_this.components.help();
					
					// Navigation
					_this.components.nav();
					
					// Close Product
					_this.components.close();
					
					if (callback && typeof callback === "function") callback(data["alias"]);
					
				}, (!startWith ? 600 : 50));
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
		reload: function(container, data, direction, callback){
			var _this = this, id;
			
			if ($body[0].className.match(/openProductLoading/)) return false;
			
			if (data && typeof data !== "object" && data.match(/\d+/)) id = data;
			
			YS.status("openProductLoading", true);
			
			YS.loader.percent.init(_this.loading);
			
			var $wrapper = container.find(".product__preview__wrapper"),
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
				
						if (!id && data){
							afterGetData(data);
						}					
						else if (id && YS.models.product.hasCached(id)){
							afterGetData(YS.models.product.getCached(id));
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
				
				container[0].firstElementChild.innerHTML = tpl;
				_this.components.visited(data, "add");
				
				YS.loader.images(container.find(".image__preloading"), function(){
				
					_this.init(container);
					_this.library(container);
					
					container.find(".product__preview__wrapper").addClass("product__preview__wrapper--active");
					
					_this.loading.addClass("product__preview__loading--hide");
					
					_this.loading.on(prefixed.transition + "end", function(){
						_this.loading.off(prefixed.transition + "end");
						_this.loading.attr("class", "offTransition product__preview__loading").attr("style", "").empty();
						container[0].setAttribute("data-item", data["id"]);
						YS.status("openProductLoading", false);
						setTimeout(function(){
							_this.loading.removeClass("offTransition");
						}, 20);
						
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
			
			$root.on(prefixed.transition + "end", function(){
				$root.off(prefixed.transition + "end");
				
				$container.remove();
				if (YS.ui.containerVisited){
					_this.components.visited(false, "add");
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
			});
			
			$body.off("keyup.productQuick");
			YS.plugins.unFrozeScroll();
		}		
	}

})(site);
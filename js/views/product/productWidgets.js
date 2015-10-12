site.views.productWidgets = (function(YS){

    return {

		init: function(){
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
				
				YS.ui.favoriteWidget = $('<div class="YS__element__widget__favorite"><i class="YS__element__widget__favorite__icon fa fa-star-o"></i></div>');
				YS.ui.favoriteWidgetCount = $('<span class="YS__element__widget__favorite__count">0</span>');
				YS.ui.favoriteWidget.append(YS.ui.favoriteWidgetCount);
				$body.append(YS.ui.favoriteWidget);
				
				// Widget Favorite products
				var favCounts = YS.models.favorite.count();
			
				if (favCounts){
					YS.ui.productWidgetsFavoriteCount[0].innerHTML = favCounts;
					YS.ui.productWidgetsFavorite.addClass("product__widgets__button__favorite--active");
					YS.ui.favoriteWidgetCount[0].innerHTML = favCounts;
					YS.ui.favoriteWidget.addClass("YS__element__widget__favorite--active");
				}
				
				// Init faq button in product
				_this.faqButton();
				
				// Init favorite button in product
				_this.favoriteButton();				

				// Init favorite button in category
				_this.favoriteButtonCategory();
				
				// Arrow Down (exit)
				YS.ui.productWidgetsExit.on(clickEvent, function(){
					YS.views.productQuick.close("down");
				});
			}
		},
		faqButton: function(){
		
			var openCallbackFaq = function(){
				YS.ui.productWidgetsFaq.addClass("product__widgets__button--active");
				YS.ui.productWidgets.addClass("product__widgets--active");
			}
			var closeCallbackFaq = function(){
				YS.ui.productWidgets.removeClass("product__widgets--active");
				YS.ui.productWidgetsFaq.removeClass("product__widgets__button--active");					
			}	
			
			// Open Modal Faq
			YS.ui.productWidgetsFaq.on(clickEvent, function(){
				if (!this.className.match(/active/)){
					YS.app.faqPage("open", openCallbackFaq, closeCallbackFaq);
				}
				else {
					YS.app.faqPage("close", openCallbackFaq, closeCallbackFaq);
				}
			});
		},
		favoriteButton: function(){
		
			var openCallbackFavorite = function(_this, container){
				container.find(".YS__m-products__item").on(clickEvent, function(){
					var elem = this;
					
					_this.close();
					
					setTimeout(function(){
						YS.app.productPage({id: elem.getAttribute("data-item"), action: "reload"});
					}, (YS.device.isMobile ? 400 : 50));
				});
			}
			
			YS.ui.productWidgetsFavorite.on(clickEvent, function(){
				YS.views.productsModal.open({
					title: 'Отложенные товары в избранном',
					data: YS.plugins.reverseArray(YS.models.favorite.get()),
					openCallback: openCallbackFavorite
				});
			});			
		},
		favoriteButtonCategory: function(){
		
			var openCallbackFavorite = function(_this, container){
			
				YS.ui.favoriteWidget.addClass("YS__element__widget__favorite--open");
			
				container.find(".YS__m-products__item").on(clickEvent, function(){
					var elem = this;
					
					_this.close(function(){
					
						YS.status("openProductQuick", true);
						
						closeCallbackFavorite();
						
						YS.app.productPage({id: elem.getAttribute("data-item"), action: "load", elem: "slipCenter"});
						
					}, true);
				});
			},
			closeCallbackFavorite = function(){
				YS.ui.favoriteWidget.removeClass("YS__element__widget__favorite--open");				
			};		
			
			YS.ui.favoriteWidget.on(clickEvent, function(){
				if (!this.className.match(/open/)){
					YS.views.productsModal.open({
						title: 'Отложенные товары в избранном',
						data: YS.plugins.reverseArray(YS.models.favorite.get()),
						openCallback: openCallbackFavorite,
						closeCallback: closeCallbackFavorite
					});
				}
				else {
					YS.views.productsModal.close(closeCallbackFavorite);
				}
			});
		},
		favoriteAnimate: function(count){
			
			count = parseInt(YS.ui.productWidgetsFavoriteCount[0].innerHTML) + count;
			
			YS.ui.productWidgetsFavorite.addClass("product__widgets__button--animate");
			YS.ui.favoriteWidget.addClass("YS__element__widget__favorite--animate");
			
			YS.plugins.onEndAnimation(YS.ui.productWidgetsFavorite[0].firstElementChild, function() {
				YS.ui.productWidgetsFavorite.removeClass("product__widgets__button--animate");
				YS.ui.favoriteWidget.removeClass("YS__element__widget__favorite--animate");
				if (count > 0){
					if (!YS.ui.productWidgetsFavorite[0].className.match(/active/)){
						YS.ui.productWidgetsFavorite.addClass("product__widgets__button__favorite--active");
						YS.ui.favoriteWidget.addClass("YS__element__widget__favorite--active");
					}
				}
				else {
					YS.ui.productWidgetsFavorite.removeClass("product__widgets__button__favorite--active");
					YS.ui.favoriteWidget.removeClass("YS__element__widget__favorite--active");
				}
			});	

			setTimeout(function(){
				YS.ui.productWidgetsFavoriteCount[0].innerHTML = count;
				YS.ui.favoriteWidgetCount[0].innerHTML = count;
			}, 200);				
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
		}
	};
	
})(site);
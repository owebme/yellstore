site.views.productsFavorite = (function(YS){

    return {

		init: function(items, buttons){
			var _this = this;

			if (!items) return false;

			$(items).each(function(){
				var $item = $(this),
					id = $item.data("item");
					
				if (YS.models.favorite.has(id)){
					$item.find("." + buttons).addClass("b-product__favorite__add");
				}
					
				$item.find("." + buttons).on(clickEvent, function(e){
					e.preventDefault();
					var count = 0
					
					if (!YS.ui.productWidgetsFavorite[0].className.match(/animate/)){
					
						if (!this.className.match(/b-product__favorite__add/)){
							$(this).addClass("b-product__favorite__add");
							YS.models.favorite.set(id);
							count++;
						}
						else {
							$(this).removeClass("b-product__favorite__add");
							YS.models.favorite.remove(id);
							count--;
						}
						YS.views.productWidgets.favoriteAnimate(count);
					}
				});
			});
		},
		observer: function(){
		
			var data = YS.models.favorite.get();
			
			if (data){
			
				YS.ui.containerProducts.find("." + YS.settings.products.CS_product).each(function(){
					var $item = $(this),
						id = $item.data("item"),
						$button = $item.find("." + YS.settings.products.CS_favorite);
						
					if (YS.models.favorite.has(id)){
						if (!$button[0].className.match(/b-product__favorite__add/)){
							$button.addClass("b-product__favorite__add");
						}
					}
					else {
						if ($button[0].className.match(/b-product__favorite__add/)){
							$button.removeClass("b-product__favorite__add");
						}
					}
				});
			}
		}
	};
	
})(site);
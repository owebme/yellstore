site.views.productFavorite = (function(YS){

    return {

		init: function(container){
			var _this = this;
			
			var id = container.attr("data-item"),
				$favorite_button = container.find("."+YS.settings.productQuick.CS_addFavorite);
				
			if (YS.models.favorite.has(id)){
				$favorite_button.addClass("product__preview__desc__favorite--active");
				$favorite_button.find(".product__preview__desc__favorite__label").text("Товар уже в избранном");
			}
			
			$favorite_button.on(clickEvent, function(e){
				var elem = this, count = 0;
				e.preventDefault();
				if (elem.className.match(/active/)){
					$(elem).removeClass("product__preview__desc__favorite--active");
					$(elem).find(".product__preview__desc__favorite__label").text("Добавить в избранные");
					YS.models.favorite.remove(id);
					count--;
				}
				else {
					$(elem).addClass("product__preview__desc__favorite--active");
					$(elem).find(".product__preview__desc__favorite__label").text("Товар уже в избранном");
					YS.models.favorite.set(id);
					count++;
				}
				YS.views.productWidgets.favoriteAnimate(count);
			});
		}
	}

})(site);
(function(views, ui){

	site.views.productsFavorite = function(items){

		$(items).on(clickEvent, function(e){
			e.preventDefault();
			var count = 0;
			if (!ui.productWidgetsFavorite[0].className.match(/animate/)){
				if (!this.className.match(/b-product__favorite__add/)){
					$(this).addClass("b-product__favorite__add");
					count++;
				}
				else {
					$(this).removeClass("b-product__favorite__add");
					count--;
				}
				views.productQuick.components.favoriteAnimate(count);
			}
		});
	}
	
})(site.views, site.ui);
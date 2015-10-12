site.views.productCart = (function(YS){

    return {

		init: function(container){
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
				YS.views.productWidgets.cartAnimate(count);
			});
		}
	}

})(site);
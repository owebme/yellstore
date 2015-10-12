site.views.viewing = (function(YS){

    return {
	
		init: function(view){
			var _this = this;
		
			YS.ui.categoryPanel.selectView = YS.ui.categoryPanel.find(".YS__element__views");
			
			var getView = (view ? view : YS.models.products.getView());
			
			if (view) _this.change(view);
				
			YS.ui.categoryPanel.selectView.find(".YS__element__views__item").each(function(){
				if (this.getAttribute("data-view") == getView){
					$(this).addClass("YS__element__views__item--active");
				}
				else {
					$(this).removeClass("YS__element__views__item--active");
				}
			});
			
			YS.ui.categoryPanel.selectView.find(".YS__element__views__item").on(clickEvent, function(e){
				if (!this.className.match(/active/)){
				
					$(this).parent().find(".YS__element__views__item--active").removeClass("YS__element__views__item--active");
					$(this).addClass("YS__element__views__item--active");
					
					var view = this.getAttribute("data-view");
					
					_this.change(view);
				}
			});
		},
		change: function(view){
		
			if (view){
			
				gender = YS.models.products.getGender();
			
				YS.models.products.setView(view);
				
				if (YS.settings.products.isotope && !YS.device.mobile){
				
					YS.ui.containerProducts.addClass(YS.settings.products.CS_review).attr("id", view);
					
					YS.ui.containerProducts.find("." + YS.settings.products.CS_product_large).each(function(){
						var id = this.getAttribute("data-item");
						$(this).addClass(YS.settings.products.CS_product_loadable);
						$(this).find("img:first")
						.attr("data-lazy", YS.settings.products.path + (gender ? "/" + gender : "") + "/" + id + "_" + (view == "view1" ? "1" : "2") + ".jpg")
						.attr("data-rollover", YS.settings.products.path + (gender ? "/" + gender : "") + "/" + id + "_" + (view == "view1" ? "2" : "3") + ".jpg");
					});
					
					setTimeout(function(){
						YS.ui.isotopeProducts.layout();
						YS.views.products.lazyLoad();
					}, 20);
				}
			}
		}
	};
	
})(site);
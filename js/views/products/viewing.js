site.views.viewing = (function(YS){

    return {
	
		init: function(){
		
			YS.ui.productsView = YS.ui.productsPanel.find(".YS__element__select__views");
			
			var getView = YS.models.products.getView(),
				isotopeObserver = false;
				
			YS.ui.productsView.find(".YS__element__select__view__sort").each(function(){
				if (this.getAttribute("data-view") == getView){
					$(this).addClass("YS__element__select__view__sort--active");
				}
				else {
					$(this).removeClass("YS__element__select__view__sort--active");
				}
			});
			
			YS.ui.productsView.find(".YS__element__select__view__sort").on(clickEvent, function(e){
				if (!this.className.match(/active/)){
				
					$(this).parent().find(".YS__element__select__view__sort--active").removeClass("YS__element__select__view__sort--active");
					$(this).addClass("YS__element__select__view__sort--active");
					
					var view = this.getAttribute("data-view"),
						gender = YS.models.products.getGender();
					
					YS.models.products.setView(this.getAttribute("data-view"));
					
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
			});
		}
	};
	
})(site);
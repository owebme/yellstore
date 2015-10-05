site.views.sorting = (function(YS){

    return {
	
		init: function(){
		
			YS.template.init("productsSorting", function(){

				YS.ui.productsSort = $(YS.template.productsSorting);
				YS.ui.productsView = YS.ui.productsSort.find(".YS__element__select__views");
				
				var productsView = YS.models.products.getView(),
					$form = YS.ui.productsSort.find("form");
					
				YS.ui.productsView.find(".YS__element__select__view__sort").each(function(){
					if (this.getAttribute("data-view") == productsView){
						$(this).addClass("YS__element__select__view__sort--active");
					}
					else {
						$(this).removeClass("YS__element__select__view__sort--active");
					}
				});
					
				$page_content.before(YS.ui.productsSort);
				
				YS.ui.productsView.find(".YS__element__select__view__sort").on(clickEvent, function(e){
					if (!this.className.match(/active/)){
					
						$(this).parent().find(".YS__element__select__view__sort--active").removeClass("YS__element__select__view__sort--active");
						$(this).addClass("YS__element__select__view__sort--active");
						
						var view = this.getAttribute("data-view"),
							gender = YS.models.products.getGender();
						
						YS.models.products.setView(this.getAttribute("data-view"));
						
						if (YS.settings.products.isotope && !YS.device.mobile){
						
							YS.ui.containerCategory.addClass(YS.settings.products.CS_review).attr("id", view);
							
							YS.ui.containerCategory.find("." + YS.settings.products.CS_product_large).each(function(){
								var id = this.getAttribute("data-item");
								$(this).addClass(YS.settings.products.CS_product_loadable);
								$(this).find("img:first")
								.attr("data-lazy", YS.settings.products.path + (gender ? "/" + gender : "") + "/" + id + "_" + (view == "view1" ? "1" : "2") + ".jpg")
								.attr("data-rollover", YS.settings.products.path + (gender ? "/" + gender : "") + "/" + id + "_" + (view == "view1" ? "2" : "3") + ".jpg");
							});
							
							setTimeout(function(){
								YS.ui.productsSection.layout();
								YS.views.products.lazyLoad();
							}, 20);
							
							setTimeout(function(){
								YS.ui.containerCategory.removeClass(YS.settings.products.CS_review);
							}, 1200);
						}
					}
				});
				
				YS.ui.productsSort.find(".YS__element__select__value").on(clickEvent, function(e){
					var $value = $(this),
						$select = $value.parent(),
						targetElement = e.target,
						value;
						
					$document.off(clickEvent+".dropdown");
					$select.find(".YS__element__select__dropdown__item").off(clickEvent);
					
					if (!$select[0].className.match(/active/)){
					
						$select.addClass("YS__element__select--active");
						
						$select.find(".YS__element__select__dropdown__item").on(clickEvent, function(e){
							if (!this.className.match(/checked/)){
								$select.find(".YS__element__select__dropdown__item--checked").removeClass("YS__element__select__dropdown__item--checked");
								$(this).addClass("YS__element__select__dropdown__item--checked");
								$value.text(this.innerHTML);
								value = this.getAttribute("data-value");
								$select.find(".YS__select").val(value);
								YS.settings.sorting.callback($form);
							}
						});
						
						$document.on(clickEvent+".dropdown", function(e){
							if (e.target !== targetElement){
								$select.removeClass("YS__element__select--active");
							}
						});
					}
					else {
						$select.removeClass("YS__element__select--active");
					}
				});
			});
		}
	};
	
})(site);
site.views.sorting = (function(YS){

    return {
	
		init: function(){
		
			YS.template.init("productsSorting", function(){

				YS.ui.productsPanel = $(YS.template.productsSorting);
				
				var $form = YS.ui.productsPanel.find("form");
					
				$page_content.before(YS.ui.productsPanel);
				
				YS.ui.productsPanel.find(".YS__element__select__value").on(clickEvent, function(e){
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
site.views.sorting = (function(YS){

    return {
	
		init: function(){
				
			YS.ui.categoryPanel.sorting = YS.ui.categoryPanel.find(".YS__form__sorting");
			
			YS.ui.categoryPanel.sorting.find(".YS__element__select__value").on(clickEvent, function(e){
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
							$select.find(".YS__element__select__options").val(value);
							YS.settings.sorting.callback(YS.ui.categoryPanel.sorting);
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
		}
	};
	
})(site);
site.views.productHelp = (function(YS){

    return {

		init: function(delay){
			var _this = this;
			
			if (!delay) delay = 1500;
			
			var help = _this.get();
			
			if (!help){
				
				setTimeout(function(){
				
					if (YS.device.isMobile){
						YS.plugins['ui-help']({
							block: "modal",
							drag: "only",
							direction: "horizontal",
							text: "Перетаскивайте слайды горизонтально<br /> для навигации по соседним товарам",
							close: 3500
						});							
					}
					else {
						YS.plugins['ui-help']({
							block: "modal",
							keyboard: "only",
							direction: "horizontal",
							text: "Используйте клавиши на клавиатуре<br /> для навигации по соседним товарам",
							close: 2500
						});
					}
					
					_this.set();
					
				}, delay);
			}
		},
		set: function(){
		
			if (YS.device.isLocalStorage){
				localStorage["YS__help__products_nav"] = 1;
			}
			else {
				$.cookie('YS__help__products_nav', 1, {path: '/'});
			}
		},
		get: function(){
		
			if (YS.device.isLocalStorage){
				return localStorage["YS__help__products_nav"];
			}
			else {
				return $.cookie('YS__help__products_nav');
			}		
		}		
	};

})(site);
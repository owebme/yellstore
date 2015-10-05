site.views.productsModal = (function(YS){

    return {
	
		open: function(title, array, openCallback, closeCallback){
		
			var _this = this, data = {};
		
			data["title"] = title;
			data["products"] = array;
			data["path"] = YS.settings.products.path;
			
			YS.ui.productsModal = $(YS.template.productsModal(data));
			
			$body.append(YS.ui.productsModal);
		
			YS.plugins.overlay(true);
			
			setTimeout(function(){
				YS.ui.productsModal.addClass("YS__m-products--active");
			}, 20);
			
			YS.status("openProductsModal", true);
					
			// Close modal products visited
			YS.ui.productsModal.find(".YS__m-products__close").on("click", function(e){
				e.preventDefault();
				_this.close(closeCallback);
			});
			
			// Close (key esc)
			$body.on("keyup.productsModal", function(e){
				if (e.which == "27"){
					_this.close(closeCallback);
				}
			});		
		
			if (openCallback && typeof openCallback === "function") openCallback();
		
		},
		close: function(callback){
	
			YS.ui.productsModal.addClass("YS__m-products--hide");
			YS.plugins.overlay(false);
			
			setTimeout(function(){
				YS.ui.productsModal.remove();
			}, 1000);
			
			YS.status("openProductsModal", false);

			$body.off("keyup.productsModal");
			
			if (callback && typeof callback === "function") {
				callback();
			}
		}
	};

})(site);
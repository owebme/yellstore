site.views.productsModal = (function(YS){

    return {
	
		open: function(params){
		
			var _this = this, data = {};
		
			data["title"] = params.title;
			data["products"] = params.data;
			data["path"] = YS.settings.products.path;
			
			YS.ui.productsModal = $(YS.template.productsModal(data));
			YS.ui.productsModalClose = YS.ui.productsModal.find(".YS__m-products__close");
			
			$body.append(YS.ui.productsModal);
		
			YS.plugins.overlay(true);
			
			setTimeout(function(){
				YS.ui.productsModal.addClass("YS__m-products--active");
			}, 20);
			
			YS.status("openProductsModal", true);
					
			// Close modal products visited
			YS.ui.productsModalClose.on(clickEvent, function(e){
				e.preventDefault();
				_this.close(params.closeCallback);
			});
			
			// Close (key esc)
			$body.on("keyup.productsModal", function(e){
				if (e.which == "27"){
					_this.close(params.closeCallback);
				}
			});		
		
			if (params.openCallback && typeof params.openCallback === "function") params.openCallback(_this, YS.ui.productsModal);
		
		},
		close: function(callback, overlay){
		
			YS.ui.productsModal.addClass("YS__m-products--hide");
			
			if (!overlay) {
				
				YS.plugins.overlay(false);
				
				if (YS.ui.containerProduct){
					YS.ui.containerProduct.on(prefixed.transition + "end", function(){
						YS.ui.containerProduct.off(prefixed.transition + "end");
						YS.ui.productsModal.remove();
					});
				}
				else {
					$root.on(prefixed.transition + "end", function(){
						$root.off(prefixed.transition + "end");
						YS.ui.productsModal.remove();
					});
				}				
			}
			else {
				if (YS.device.isMobile){
					YS.ui.productsModal.remove();
				}
				else {
					setTimeout(function(){
						YS.ui.productsModalClose.on(prefixed.transition + "end", function(){
							YS.ui.productsModalClose.off(prefixed.transition + "end");
							YS.ui.productsModal.remove();
						});
					}, 33);
				}
			}
			
			YS.status("openProductsModal", false);

			$body.off("keyup.productsModal");
			
			if (callback && typeof callback === "function") {
				callback();
			}
		}
	};

})(site);
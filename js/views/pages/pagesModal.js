site.views.pagesModal = (function(YS){

    return {
	
		open: function(tpl, openCallback, closeCallback){
			var _this = this;
			
			if (!YS.device.isMobile && !YS.ui.containerProduct){
				$root[0].style.marginLeft = -YS.plugins.sbWidth() + 'px';
			}
		
			YS.plugins.overlay(true);
			YS.status("openPageModal", true);
			
			if (!YS.template[tpl]) YS.template[tpl] = document.getElementById(tpl).innerHTML;
			$body.append(YS.template[tpl]);
			
			YS.ui.pagesModal = $($body[0].lastElementChild);
			
			setTimeout(function(){
				YS.ui.pagesModal.addClass("YS__modal--active");
			}, 20);
			
			YS.ui.pagesModal.on(prefixed.transition + "end", function(){
				YS.ui.pagesModal.off(prefixed.transition + "end");
				YS.plugins.scrollable(YS.ui.pagesModal.children());
			});
			
			// Close Modal Faq
			YS.ui.pagesModal.find(".YS__modal__close").on(clickEvent, function(){
				_this.close(closeCallback);
			});
			
			// Close (key esc)
			$body.on("keyup.pagesModal", function(e){
				if (e.which == "27"){
					_this.close(closeCallback);
				}
			});
			
			if (openCallback) openCallback();

			YS.address.beforeModal = YS.app.getUri();
		},
		close: function(callback){
		
			if (!YS.device.isMobile && !YS.ui.containerProduct){
				$root[0].style.marginLeft = '0px';
			}		
		
			YS.status("openPageModal", false);
			
			YS.ui.pagesModal.removeClass("YS__modal--active");
			YS.plugins.overlay(false);
			
			if (callback) callback();
			
			if (YS.ui.containerProduct){
				YS.ui.containerProduct.on(prefixed.transition + "end", function(){
					YS.ui.containerProduct.off(prefixed.transition + "end");
					YS.ui.pagesModal.remove();
				});
			}
			else {
				$root.on(prefixed.transition + "end", function(){
					$root.off(prefixed.transition + "end");
					YS.ui.pagesModal.remove();
				});				
			}
			
			if (YS.address.beforeModal) {
				if (YS.address.beforeModal == YS.app.getUri()){
					YS.app.setUri();
				}
				else {
					YS.app.setUri(YS.address.beforeModal);
				}
			}
			else {
				YS.app.setUri();
			}
			
			$body.off("keyup.pagesModal");
		}
	};
	
})(site);
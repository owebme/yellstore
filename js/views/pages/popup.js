site.views.popup = (function(YS){

    return {
		
		open: function(params){
			var _this = this;
	
			if (params && typeof params === "object"){
			
				YS.ui.popup = $('<div class="YS__popup"></div>');
				YS.ui.popupWindow = $('<div class="YS__popup__window' + (params.popup ? ' YS__popup__' + params.popup : '') + '"></div>');
				YS.ui.popupClose = $('<div class="YS__popup__close"><div class="YS__element_menu YS__element_menu--close YS__element_menu-xs"><div class="YS__element_menu__close YS__element_menu__close--dark"><div class="YS__element_menu__close_bg"></div></div></div></div>');
				YS.ui.popup.append('<div class="YS__popup__helper"></div>');
				YS.ui.popup.append(YS.ui.popupWindow);
				YS.ui.popupWindow.append(params.html);
				YS.ui.popupWindow.append(YS.ui.popupClose);
				
				YS.ui.popupWindow.css("width", params.width + "px");
				
				$body.append(YS.ui.popup);
				
				setTimeout(function(){
					YS.ui.popup.addClass("YS__popup--active");
				}, 5);
				
				YS.ui.popupClose.on(clickEvent, function(){
					_this.close();
				});
				
				YS.ui.popup.on(clickEvent, function(e){
					if (e.target.className.match(/YS__popup--active/)){
						_this.close();
					}
				});
			}
		},
		close: function(){
			
			YS.ui.popup.removeClass("YS__popup--active");
			
			setTimeout(function(){
				YS.ui.popup.on(prefixed.transition + "end", function(){
					YS.ui.popup.off(prefixed.transition + "end");
					setTimeout(function(){
						YS.ui.popup.remove();
					}, 200);
				});
			}, 100);
		}
	};
	
})(site);
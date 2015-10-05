site.views.search = (function(YS){

    return {
	
		init: function(){
			var _this = this;
			
			YS.template.init("search", function(){
			
				_this.search = $(YS.template.search);
				
				$body.append(_this.search);
				
				_this.form = _this.search.find("form");
				_this.input = _this.search.find(".YS__m-search__value");
				
				// Open Search
				YS.ui.panel.search.on("click", function(){
					if (!this.className.match(/active/)){
						_this.open();
					}
					else {
						_this.close();
					}
				});
				
				// Action Search
				_this.form.submit(function(e){
					e.preventDefault;
					_this.action();
					return false;
				});
				
				// Close Search
				_this.search.find(".YS__m-search__close").on("click", function(){
					_this.close();
				});		
				
			});
		},
		open: function(){
			var _this = this;
		
			YS.status("openSearch", true);
		
			YS.ui.panel.search.addClass("YS__panel__search--active");
			YS.ui.panel.self.addClass("YS__panel--active");
			YS.plugins.overlay(true);
			
			_this.input.focus();
			
			_this.search.delay(400).velocity({
				opacity: 1
			}, 'easeOutCubic', 420);
			
			YS.views.search.loading = false;
			YS.views.search.start = false;
			
			// Close (key esc)
			$body.on("keyup.searchClose", function(e){
				if (!YS.ui.containerProduct && e.which == "27"){
					_this.close();
				}
			});
		},
		action: function(){
			var _this = this;
		
			if (!YS.views.search.loading){
				
				YS.views.search.loading = true;
				
				if (!YS.views.search.start){
				
					YS.views.search.start = true;
				
					_this.search.addClass("YS__m-search--active");
				
					setTimeout(function(){
						YS.settings.search.callback(_this.input.val());
					}, 450);
					
					setTimeout(function(){
						YS.status("activeSearch", true);
					}, 650);
				}
				else {
					YS.settings.search.callback(_this.input.val());
				}
			}
		},
		close: function(){
			var _this = this;
			
			YS.plugins.overlay(false);
			YS.ui.panel.self.removeClass("YS__panel--active");
			YS.ui.panel.search.removeClass("YS__panel__search--active");
			
			if ($body[0].className.match(/activeSearch/) && YS.storage.productsMemory){
				YS.views.products.reload(false, false, true);
			}
			
			_this.search.velocity({
				opacity: 0
			}, 'easeOutCubic', 420, function(){
				_this.search.removeClass("YS__m-search--active");
				YS.status("activeSearch", false);
				YS.status("openSearch", false);
				YS.views.breadcrumbs.reset();
			});
			
			$body.off("keyup.searchClose");
		}
	};
	
})(site);
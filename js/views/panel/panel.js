site.views.panel = (function(YS){

    return {
	
		init: function(){
		
			YS.template.init("panel", function(){
			
				YS.ui.panel = {};
			
				YS.ui.panel.self = $(YS.template.panel);
					
				$root.append(YS.ui.panel.self);
				
				YS.ui.panel.menu = YS.ui.panel.self.find('.YS__panel__menu');
				YS.ui.panel.filter = YS.ui.panel.self.find('.YS__panel__filter');
				YS.ui.panel.search = YS.ui.panel.self.find('.YS__panel__search');
				YS.ui.panel.cart = YS.ui.panel.self.find('.YS__panel__cart');
				YS.ui.panel.cartCount = YS.ui.panel.cart.find(".YS__panel__cart__count");
				YS.ui.panel.phone = YS.ui.panel.self.find('.YS__panel__phone');		
					
				YS.views.panelMenu.init();
				YS.views.links.init();
				YS.views.filter.init();
				YS.views.search.init();
				YS.views.cart.init();
				YS.views.phone.init();
			});
		}
	};

})(site);
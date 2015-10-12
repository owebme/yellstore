site.app = (function(YS){

    return {

		routes: {
			"/index": "indexPage",
			"/": "catalogPage",
			"/c/{gender}/{category}": "categoryPage",
			"/c/{gender}/{category}/page_{id}": "categoryPage",
			"/c/{gender}/{category}/{category}": "categoryPage",
			"/c/{gender}/{category}/{category}/page_{id}": "categoryPage",			
			"/p/{id}/{alias}": "productPage",
			"/faq/": "faqPage"
		},
		indexPage: function(){
			YS.views.headerMenu.init();
			YS.loading();
		},	
		catalog: function(data){
			YS.template.init("products", function(){
				YS.views.products.load(data, function(){
					YS.views.headerMenu.init();
					YS.views.sorting.init();
					YS.views.viewing.init();
					YS.views.breadcrumbs.init();
					YS.views.panel.init();
					YS.views.products.library();
					YS.template.init("productsModal");
					YS.loading();
				});
			});
		},
		catalogPage: function(){
			YS.models.products.setGender("woman");
			this.catalog();
		},			
		categoryPage: function(gender, category, page){
			YS.models.products.setGender(gender);
			this.catalog(category);
		},		
		productPage: function(id, params){
			var _this = this;
		
			if (id == "random") id = _.first(_.shuffle(YS.models.products.items()), 1)[0].id;
			
			if (!params) params = {};
		
			YS.models.product.getProduct(id);
			
			// Change current product
			if (params.action == "reload"){
				YS.views.productQuick.reload(id, params.direction, function(alias){
					_this.setUri("p/" + id + "/" + alias);
				});
			}
			// Open product (ajax)
			else if (params.action == "load"){
				YS.views.productQuick.load(id, params.elem, function(alias){
					_this.setUri("p/" + id + "/" + alias);
				});
			}
			// Load product (start page)
			else {
				YS.address.beforeProduct = "/";
				YS.views.productQuick.load(id, false, function(){
					_this.catalog();
				});
			}
		},
		faqPage: function(state, openCallback, closeCallback){
			var _this = this;
			
			if (state != "close"){
			
				var _openCallback = function(){
					$(".YS__modal__phone__call").on(clickEvent, function(){
						YS.views.phone.open();
					});
					if (openCallback) openCallback();
				};
			
				YS.views.pagesModal.open(YS.settings.template.faq, _openCallback, closeCallback);

				if (!state) {
					_this.catalog();
				}
				else {
					_this.setUri("/faq/");
				}
			}
			else if (state == "close"){
			
				YS.views.pagesModal.close(closeCallback);
			}
		},		
		init: function(){
			this._routes = [];
			for (var route in this.routes){
				var methodName = this.routes[route];
				this._routes.push({
					pattern: new RegExp('^'+route.replace(/{[^\/]*}/g, '([^\\/]*)')+'$'),
					callback: this[methodName]
				});
			}
			this.nav(window.location.pathname);
		},
		nav: function(path){
			var i = this._routes.length, match = false;
			while (i--){
				var args = path.match(this._routes[i].pattern);
				if (args){
					match = true;
					this._routes[i].callback.apply(this, args.slice(1));
				}
			}
			if (!match) {
				YS.plugins.pageError("404");
				YS.loading();
			}
		},
		setUri: function(url, title){
			if (url && url != "/") {History.replaceState(null, title || null, '/' + url);}
			else if (!url || url == "/") {History.replaceState(null, title || null, '/');}
		},
		getUri: function(){
			return History.getState().hash.replace('/', '').split('?')[0];
		}
	};
}(site));
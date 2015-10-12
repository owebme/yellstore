site.app = (function(YS){

    return {

		routes: {
			"/index": "indexPage",
			"/": "catalogPage",
			"/c/{gender}/": "catalogPage",
			"/c/{gender}/{id}/{alias}": "categoryPage",
			"/c/{gender}/{id}/{alias}/page/{page}": "categoryPage",
			"/p/{id}/{alias}": "productPage",
			"/faq/": "faqPage"
		},
		indexPage: function(){
			YS.views.headerMenu.init();
			YS.loading();
		},
		catalog: function(category){
			YS.template.init("products", function(){
				YS.views.products.load(category, function(){
					YS.views.headerMenu.init();
					YS.views.categoryPanel.init();
					YS.views.panel.init();
					YS.views.phone.init();
					YS.views.products.library();
					YS.template.init("productsModal");
					YS.loading();
				});
			});
		},
		catalogPage: function(params){
			if (params.gender) {
				YS.models.products.setGender(params.gender);
				this.catalog(params.gender);
			}
			else {
				YS.models.products.setGender("woman");
				this.catalog();
			}
		},
		categoryPage: function(params){
			var _this = this;
			
			if (params.gender) YS.models.products.setGender(params.gender);
			if (params.page) {
				YS.storage.categoryPage = params.page;
			}
			else if (!params.page && params.action == "load"){
				YS.storage.categoryPage = 1;
			}
			
			// Replace by params.id
			var category = params.alias.replace(/\/page\/(\d+)/g, "");

			// Change current category
			if (params.action == "reload"){
				YS.views.products.reload(category, function(){
					_this.setUri(params.alias);
				});
			}			
			// Open category (ajax)
			else if (params.action == "load"){

				if (YS.views.panelMenu.title) YS.views.panelMenu.title.innerHTML = params.title;

				if (params.path) YS.views.breadcrumbs.update(params.path);
				YS.views.products.reload(category, function(){
					_this.setUri(params.alias, params.title);
				});				
			}
			// Load category (start page)
			else {
				_this.catalog(category);
			}
		},		
		productPage: function(params){
			var _this = this,
				id = params.id;
		
			if (id == "random") id = _.first(_.shuffle(YS.models.products.items()), 1)[0].id;
		
			if (!YS.models.product.hasCached(id)) YS.models.product.getProduct(id);
			
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
					route: route,
					pattern: new RegExp('^'+route.replace(/{[^\/]*}/g, '([^\\/]*)')+'$'),
					method: methodName
				});
			}
			this.nav(window.location.pathname);
		},
		nav: function(url){
			var i = this._routes.length, route = false;
			while (i--){
				var args = url.match(this._routes[i].pattern);
				if (args){
					route = this._routes[i].route;
					var params = {},
						_args = route.match(/{(.+?)}/g, '$1'),
						result = args.slice(1);
						
					if (_args){
						for (var j = 0, arg; arg = _args[j++];) {
							params[arg.replace(/[{|}]/g, "")] = result[j - 1];
						}
					}
					else {
						params = "";
					}
					this[this._routes[i].method](params); break;
				}
			}
			if (!route){
				this.pageError(404);
			}
		},
		setUri: function(url, title){
			if (!title) title = document.title;
			if (url && url != "/") {History.replaceState(null, title || null, '/' + url);}
			else if (!url || url == "/") {History.replaceState(null, title || null, '/');}
		},
		getUri: function(){
			return History.getState().hash.replace('/', '').split('?')[0];
		},
		pageError: function(data){
			
			var template = Handlebars.compile(document.getElementById('server-error').innerHTML);
			
			$body.append(template({error: data}));
			
			YS.loading();
		}
	};
}(site));
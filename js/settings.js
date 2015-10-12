(function(app, device, models, views, plugins, storage, settings, ui){

	// Template Settings
	settings.template = {
		products: "products-template",
		product: "product-template",
		productsModal: "m-products",
		categoryPanel: "category-panel",
		categoryPanelFilterBox: "category-panel-filterBox",
		spinner: "spinner-template",
		loading: "loading-template",
		panel: "filter-panel",
		panelMenu: "panel-menu",
		search: "m-search-products",
		faq: "m-product-faq"
	};

	// Header Menu Settings
	settings.headerMenu = {
	
		// Open Links Ajax
		ajax: true,
	
		// Callback action click header menu items
		callback: function(elem){
		
			plugins.loading(true, function(){
			
				var gender = site.ui.gender_menu.find(".header__gender__menu__item--active"),
					genderUrl = "",
					title = "",
					alias = "",
					data = [];
				
				if (gender) {
					genderUrl = gender.attr("href");
					data.push({"id": gender.attr("data-id"), "title": gender.text(), "alias": "/c" + genderUrl});
					models.products.setGender(genderUrl);
				}
				
				var id = plugins.rand(2000, 9999);
					
				if (elem.className.match(/header__menu__parents__link/)){
					
					title = $(elem).text();
					alias = "/c" + (genderUrl ? genderUrl : "/") + id + "/" + plugins.translit(title);
					data.push({"id": id, "title": title, "alias": alias});
				}
				else if (elem.className.match(/header__menu__dropdown__link/)){
					
					var p_title = $(elem).closest(".header__menu__dropdown__wrapper").data("name");
					var _id = plugins.rand(2000, 9999);
					var p_alias = "/c" + (genderUrl ? genderUrl : "/") + _id + "/" + plugins.translit(p_title);
					data.push({"id": _id, "title": p_title, "alias": p_alias});
					
					title = $(elem).text();
					alias = "/c" + (genderUrl ? genderUrl : "/") + id + "/" + plugins.translit(p_title) + "-" + plugins.translit(title);
					data.push({"id": id, "title": title, "alias": alias});
				}
				app.categoryPage({
					action: "load",
					id: id,
					title: title,
					alias: alias,
					path: data
				});
			});
		}
	};
	
	// Breadcrumbs Menu Settings
	settings.breadcrumbsMenu = {
	
		// Open Link Ajax
		ajax: true,
	
		// Callback Action
		callback: function(elem, update){
		
			plugins.loading(true, function(){
				app.categoryPage({
					action: "load",
					id: elem.getAttribute("data-id"),
					title: $(elem).text(),
					alias: elem.getAttribute("href"),
					path: update
				});
			});
		}
	};

	// Panel Menu Category Settings
	settings.panelMenu = {
	
		// Open Link Ajax
		ajax: true,
		templateCloudLinks: "cloud-links",
	
		// Callback Action
		callback: function(params){
			
			views.panelMenu.close();
			
			var id = plugins.rand(2000, 9999),
				alias = '/c/woman/' + id + '/' + params.alias;
			
			plugins.loading(true, function(){
				app.categoryPage({
					action: "load",
					id: id,
					title: params.title,
					alias: alias
				});
			});
		}
	};
	
	// Cloud Links Settings
	settings.cloudLinks = {
	
		// Open Link Ajax
		ajax: true,
	
		// Callback Action
		callback: function(params){
		
			views.panelMenu.close();
			
			var id = plugins.rand(2000, 9999),
				alias = '/c/woman/' + id + '/' + params.alias;
			
			plugins.loading(true, function(){
				app.categoryPage({
					action: "load",
					id: id,
					title: params.title,
					alias: alias
				});
			});
		}
	};	

	// Products Settings
	settings.products = {
	
		CS_container: "products__section",
		CS_product: "product__item",
		CS_product_large: "product__item--large",
		CS_product_loadable: "product__item--loadable",
		CS_reload: "products__reload",
		CS_review: "products__review",
		CS_openLink: (device.isMobile ? "product__item__image" : "product__quick-look"),
		CS_favorite: "b-product__favorite",
		lazyLoad_limit: 15,
		itemsPage: 28, 
		isotope: true,
		path: "http://yellstore.uplecms.ru/images/products",
		img_lite: "img2"
	};
	
	// ProductQuick Settings
	settings.productQuick = {
		
		CS_container: "product__preview",
		CS_container_close: "product__preview__close",
		CS_products: "productt__item",
		CS_openLink_products: "productt__item__openLink",
		CS_addCart: "YS__element__btn--cart",
		CS_addFavorite: "product__preview__desc__favorite",
		CS_favorite_products: "b-product__favorite",
		CS_gallery_products: "productt__item__openGallery",
		CS_item_slider: "product__preview__slideshow__container",
		CS_item_slider_products: "productt__item__slider",
		CS_theme_prod_recomend: (!device.isMobile ? "boxed" : ""),
		CS_theme_prod_more: (!device.isMobile ? "twirl" : ""),
		flickity_products: true,
		visited_limit: 5,
		visited_memory: true,
		progress: true
	};	
	
	// Filter Settings
	settings.filter = {
	
		// Memory Filter settings
		memory: true,
	
		// Callback Action
		callback: function(data, afterLoading){
			var _this = this;
		
			plugins.loading(true, function(){
			
				console.log("Loading filter: " + data);
				
				if (_this.memory) $.cookie('YS__filter', data, {expires: 1, path: '/'});
				
				models.products.getProducts(storage.category, storage.categoryPage, function(data){
					views.products.reload(data, function(){
						afterLoading();
					});
				});
			});
		}
	};
	
	// Search Settings
	settings.search = {
	
		// Callback Action
		callback: function(query){
		
			plugins.loading(true, function(){
			
				$.cookie('YS__search', query, {expires: 1, path: '/'});
				
				views.products.reload("category", function(){
					views.search.loading = false;
					views.breadcrumbs.result('Результат поиска: найдено <strong>'+ site.plugins.rand(20, 50) +' товаров</strong>');
				});
			});
		}
	};	
	
	// Sorting Settings
	settings.sorting = {
	
		// Loading Sort out Cookie
		cookie: true,
	
		// Callback Action
		callback: function(form){
			var _this = this;
		
			plugins.loading(true, function(){
		
				var data = JSON.stringify(form2js(form[0]));
			
				if (_this.cookie) $.cookie('YS__sorting', data, {expires: 1, path: '/'});
				
				models.products.getProducts(storage.category, storage.categoryPage, function(data){
					views.products.reload(data);
				});
			});
		}
	};	
	
	// Pigination Settings
	settings.pigination = {
	
		// Open Link Ajax
		ajax: true,
		
		// Range pages
		range: 8,
	
		// Callback Action
		callback: function(params){
			var _this = this;
		
			plugins.loading(true, function(){
				app.categoryPage({
					action: "reload",
					page: params.page,
					alias: params.alias
				});
			});
		}
	};		

	// Cart Settings
	settings.cart = {
	
		template: "m-cart"
	};	
	
	
})(site.app, site.device, site.models, site.views, site.plugins, site.storage, site.settings, site.ui);
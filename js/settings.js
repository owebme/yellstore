(function(app, models, views, plugins, settings, ui){

	// Template Settings
	settings.template = {
		products: "products-template",
		product: "product-template",
		productsModal: "m-products",
		productsSorting: "sort-panel",
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
					gender_url = "",
					title = "",
					url = "",
					data = [];
				
				if (gender) {
					gender_url = gender.attr("href");
					data.push({"title": gender.text(), "url": "/c" + gender_url});
					models.products.setGender(gender_url);
				}
					
				if (elem.className.match(/header__menu__parents__link/)){
					
					title = $(elem).text();
					url = "/c" + (gender_url ? gender_url : "/") + plugins.translit(title);
					data.push({"title": title, "url": url});
				}
				else if (elem.className.match(/header__menu__dropdown__link/)){
					
					var p_title = $(elem).closest(".header__menu__dropdown__wrapper").data("name");
					var p_url = "/c" + (gender_url ? gender_url : "/") + plugins.translit(p_title);
					data.push({"title": p_title, "url": p_url});
					
					title = $(elem).text();
					url = "/c" + (gender_url ? gender_url : "/") + plugins.translit(p_title) + "/" + plugins.translit(title);
					data.push({"title": title, "url": url});
				}
				
				views.panelMenu.title.innerHTML = title;
				views.breadcrumbs.update(JSON.stringify(data));
				views.products.reload("category", function(){
					app.setUri(url, title);
				});
			});
		}
	};
	
	// Breadcrumbs Menu Settings
	settings.breadcrumbsMenu = {
	
		// Open Link Ajax
		ajax: true,
	
		// Callback Action
		callback: function(elem, afterLoading){
		
			plugins.loading(true, function(){
			
				var title = $(elem).text();
					
				views.panelMenu.title.innerHTML = title;
				views.products.reload("category", function(){
					app.setUri(elem.getAttribute("href"), title);
				});
				
				if (afterLoading) afterLoading();
			});
		}
	};

	// Panel Menu Category Settings
	settings.panelMenu = {
	
		// Open Link Ajax
		ajax: true,
		templateCloudLinks: "cloud-links",
	
		// Callback Action
		callback: function(elem){
			
			views.panelMenu.close();
			
			var title = $(elem).text();
			
			plugins.loading(true, function(){
				app.setUri("c/" + plugins.translit(title), title);
				views.panelMenu.title.innerHTML = title;
				views.products.reload("category");
			});
		}
	};
	
	// Cloud Links Settings
	settings.cloudLinks = {
	
		// Open Link Ajax
		ajax: true,
	
		// Callback Action
		callback: function(elem){
		
			views.panelMenu.close();
			
			var title = $(elem).text();
			
			plugins.loading(true, function(){
				//app.setUri("c/" + plugins.translit(title), title);
				views.panelMenu.title.innerHTML = title;
				views.products.reload("category");
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
		CS_openLink: "product__quick-look",
		CS_favorite: "b-product__favorite",
		lazyLoad_limit: 15, 
		isotope: true,
		path: "http://yellstore.uplecms.ru/images/products",
		img_lite: "img2"
	};
	
	// ProductQuick Settings
	settings.productQuick = {
		
		CS_container: "product__preview",
		CS_container_close: "product__preview__close",
		CS_products: "product__preview__product",
		CS_openLink_prod_recomend: "product__preview__product__recomend",
		CS_openLink_prod_more: "product__quick-look",
		CS_addCart: "YS__element__btn--cart",
		CS_addFavorite: "product__preview__desc__favorite",
		CS_favorite_products: "b-product__favorite",
		CS_item_slider: "product__preview__slideshow__container",
		CS_item_slider_products: "product__preview__product__slider",
		flickity_products: true,
		visited_limit: 5,
		visited_memory: true,
		progress: true
	};	
	
	// Filter Settings
	settings.filter = {
	
		// Loading Filter out Cookie
		cookie: true,
	
		// Callback Action
		callback: function(){
			var _this = this;
		
			plugins.loading(true, function(){
		
				var data = JSON.stringify(form2js(ui.panel.filter_container[0]));
				
				if (_this.cookie) $.cookie('YS__filter', data, {expires: 1, path: '/'});
				
				views.products.reload("category", function(){
					views.filter.exit();
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
			
				views.products.reload("category");
			});
		}
	};	

	// Cart Settings
	settings.cart = {
	
		template: "m-cart"
	};	
	
	
})(site.app, site.models, site.views, site.plugins, site.settings, site.ui);
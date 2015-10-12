site.views.productVisited = (function(YS){

    return {
	
		init: function(data){
			var _this = this;
			
			// Loading products visited
			if (YS.settings.productQuick.visited_limit){
			
				if (!YS.ui.containerVisited){
			
					YS.ui.containerVisited = $('<div class="product__preview__visited"></div>');
					YS.ui.containerVisited_open = $('<div class="product__preview__visited__item__open">Посмотреть все<br><span>...</span></div>');
					YS.ui.containerVisited.append(YS.ui.containerVisited_open);
					$body.append(YS.ui.containerVisited);
				
					// Loading products visited out memory
					if (!YS.storage.productsVisited && YS.settings.productQuick.visited_memory){
						YS.storage.productsVisited = YS.models.visited.get();
					}
					if (YS.storage.productsVisited){
					
						var start = YS.storage.productsVisited.length - YS.settings.productQuick.visited_limit;
						
						if (YS.settings.productQuick.visited_limit >= YS.storage.productsVisited.length) start = 0;
					
						for (var i = start, item; item = YS.storage.productsVisited[i++];) {
							YS.ui.containerVisited_open.before('<div data-item="'+ item['id'] +'" class="product__preview__visited__item'+ (i == YS.storage.productsVisited.length?' product__preview__visited__item--last':'') +'"><img class="product__preview__visited__item__image" src="'+ YS.settings.products.path + (item['gender'] ? '/' + item['gender'] : '') + '/lite/'+ item['img'] +'_lite.jpg"></div>');
						}
						
						if (YS.storage.productsVisited.length > YS.settings.productQuick.visited_limit){
							YS.ui.containerVisited_open.addClass("product__preview__visited__item__open--active");
						}
						
						// Open product visited
						_this.click(YS.ui.containerVisited.find(".product__preview__visited__item"));
					}
					else {
						YS.storage.productsVisited = [];
					}
					
					// Open modal products visited
					if (!YS.device.isMobile){
						YS.ui.containerVisited_open.on("click", function(e){
							e.preventDefault();
							_this.open();
						});
					}
				}
				
				if (!YS.ui.containerVisited[0].className.match(/active/)){
					setTimeout(function(){
						YS.ui.containerVisited.addClass("product__preview__visited--active");
					}, 5);
				}
			}
			
			// Save last product visited
			YS.models.visited.last(data);
		},
		add: function(data){
			var _this = this;
			
			// Add product visited
			if (YS.storage.lastProductVisited && YS.settings.productQuick.visited_limit){
			
				var notDouble = true;
				
				for (var i = 0, item; item = YS.storage.productsVisited[i++];) {
					if (YS.storage.lastProductVisited["id"] == item['id']) notDouble = false;
				}
				
				if (notDouble){
			
					var counts = YS.storage.productsVisited.length;
					
					if (counts < 12){
						YS.storage.productsVisited.push(YS.storage.lastProductVisited);
					}
					else {
						YS.storage.productsVisited = _.rest(YS.storage.productsVisited);
						YS.storage.productsVisited.push(YS.storage.lastProductVisited);
					}
					// Save products visited
					if (YS.settings.productQuick.visited_memory){
						YS.models.visited.set(YS.storage.productsVisited);
					}
					if (counts >= YS.settings.productQuick.visited_limit){
						YS.ui.containerVisited.find(".product__preview__visited__item:first").remove();
					}
					
					var $item = $('<div data-item="'+ YS.storage.lastProductVisited['id'] +'" class="product__preview__visited__item product__preview__visited__item--last"><img class="product__preview__visited__item__image" src="'+ YS.settings.products.path + (YS.storage.lastProductVisited['gender'] ? '/' + YS.storage.lastProductVisited['gender'] : '') + '/lite/'+ YS.storage.lastProductVisited['img'] +'_lite.jpg"></div>');
					YS.ui.containerVisited.find(".product__preview__visited__item--last").removeClass("product__preview__visited__item--last");
					YS.ui.containerVisited_open.before($item);
					
					if (counts == YS.settings.productQuick.visited_limit && !YS.ui.containerVisited_open[0].className.match(/active/)){
						YS.ui.containerVisited_open.addClass("product__preview__visited__item__open--active");
					}
					
					// Open product visited (current product)
					_this.click($item);
				}
			}
			
			// Save last product visited
			YS.models.visited.last(data);
		},
		click: function(items){
			var _this = this;
			
			items.on(clickEvent, function(e){
				e.preventDefault();
				if (YS.device.isMobile){
					_this.open();
				}
				else {
					YS.app.productPage({id: this.getAttribute("data-item"), action: "reload"});
				}
			});
		},
		open: function(){
			var _this = this;
			
			var openCallback = function(_this, container){
				YS.ui.containerVisited.removeClass("product__preview__visited--active");
				
				container.find(".YS__m-products__item").on(clickEvent, function(){
					var elem = this;
					
					_this.close(closeCallback);
					
					setTimeout(function(){
						YS.app.productPage({id: elem.getAttribute("data-item"), action: "reload"});
					}, (YS.device.isMobile ? 400 : 50));
				});
			},
			closeCallback = function(){
				YS.ui.productsModal.on(prefixed.transition + "end", function(){
					YS.ui.productsModal.off(prefixed.transition + "end");
					YS.ui.containerVisited.addClass("product__preview__visited--active");
				});
			}
				
			YS.views.productsModal.open({
				title: 'Недавно просмотренные товары',
				data: YS.plugins.reverseArray(YS.storage.productsVisited),
				openCallback: openCallback,
				closeCallback: closeCallback
			});
		}
	};

})(site);
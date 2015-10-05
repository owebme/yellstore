site.models.product = (function(YS){

    return {
	
		getProduct: function(id){
			var _this = this;
			
			if (!_this.hasCached(id)){
		
				var items = YS.models.products.items(), size = items.length, data = {};
				
				for (var i = 0; i < size; i++) {
					if (items[i].id == id) {data = items[i]; break;}
				}
				
				if (!_.isEmpty(data)){
				
					YS.models.products.setGender(data["gender"]);
					
					var items_ = _.shuffle(items), shuffle = [];
					
					for (var i = 0; i < size; i++) {
						if (items_[i].id !== id && items_[i].gender === data["gender"]) {
							items_[i]["alias"] = YS.plugins.translit(items_[i]["title"]);
							items_[i]["price"] = YS.plugins.convertPrice(items_[i]["price"]);
							items_[i]["price_old"] = YS.plugins.convertPrice(items_[i]["price_old"]);						
							shuffle.push(items_[i]);
						}
					}
					
					data["alias"] = YS.plugins.translit(data["title"]);
					data["price_old"] = YS.plugins.convertPrice(parseInt(data["price"] * 1.25));
					data["price"] = YS.plugins.convertPrice(data["price"]);
					
					if (YS.device.isMobile){
						data["product_recomend"] = _.first(shuffle, 6);
						data["product_more"] = _.last(shuffle, 4);				
					}
					else {
						data["product_recomend"] = _.first(shuffle, 4);
						data["product_more"] = _.last(shuffle, 9);
					}
					
					_this.setCached(id, data);
				}
				else {
					return false;
				}
			}
		},
		setCached: function(id, data){

			if (id && data && !YS.storage["product_" + id]){
			
				YS.storage["product_" + id] = JSON.stringify(data);
				console.log("product_" + id + "__cached");
			}
		},	
		hasCached: function(id){
		
			if (id && YS.storage["product_" + id]){
				return true;
			}
			else {
				return false;
			}
		},
		getCached: function(id){

			if (id && YS.storage["product_" + id]){
			
				console.log("product_" + id + "__loaded");
				return JSON.parse(YS.storage["product_" + id]);
			}
			else {
				return false;
			}
		},		
		prepare: function(data){
		
			if (data && typeof data === 'object'){
			
				data["path"] = YS.settings.products.path;
			
				return $(YS.template.product(data));
			}
		},		
		getVisited: function(){
		
			var data;
		
			if (YS.device.isLocalStorage){
				data = sessionStorage['YS__products__visited'];
			}
			else {
				data = $.cookie('YS__products__visited');
			}
			
			if (typeof data === "string") return JSON.parse(data);
			
		},
		setVisited: function(data){
		
			if (YS.device.isLocalStorage){
				sessionStorage['YS__products__visited'] = JSON.stringify(data);
			}
			else {
				$.cookie('YS__products__visited', JSON.stringify(data), {path: '/'})
			}
		}
    };
	
}(site));
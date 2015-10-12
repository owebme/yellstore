site.models.product = (function(YS){

    return {
	
		getProduct: function(id, only){
			var _this = this;
			
			var result = _this.hasCached(id);
			
			if (result && !only){
				
				if (result != "wait") return _this.getCached(id);
			}
			else {
			
				if (!only) _this.setCached(id, "wait");
		
				var items = YS.models.products.items(), size = items.length, data = {};
				
				for (var i = 0; i < size; i++) {
					if (items[i].id == id) {data = items[i]; break;}
				}
				
				if (!_.isEmpty(data)){
				
					if (only){
					
						return data;
					}
					else {
				
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
							data["product_more"] = _.last(shuffle, 6);				
						}
						else {
							data["product_recomend"] = _.first(shuffle, 4);
							data["product_more"] = _.last(shuffle, 9);
						}

						_this.setCached(id, data);
					}
				}
				else {
					return false;
				}
			}
		},
		setCached: function(id, data){

			if (id && data){
			
				YS.storage["product_" + id] = JSON.stringify(data);
				if (data != "wait") console.log("Cached product: " + id);
			}
		},	
		hasCached: function(id){
		
			if (id){
			
				var result = YS.storage["product_" + id];
			
				if (result){
					
					if (result == '"wait"') {
						return "wait";
					}
					else {
						return true;
					}
				}
				else {
					return false;
				}
			}
		},
		getCached: function(id){

			if (id && YS.storage["product_" + id]){
			
				console.log("Loading is cache product: " + id);
				return JSON.parse(YS.storage["product_" + id]);
			}
			else {
				return false;
			}
		},		
		prepare: function(data){
		
			if (data && typeof data === 'object'){
				
				data["path"] = YS.settings.products.path;
				data["mobile"] = (YS.device.isMobile ? "1" : "");
				data["theme_recomend"] = YS.settings.productQuick.CS_theme_prod_recomend;
				data["theme_more"] = YS.settings.productQuick.CS_theme_prod_more;
				
				var slider_recomend = YS.settings.productQuick.CS_theme_prod_recomend;
				if (slider_recomend == "slider" || slider_recomend == "twirl") {slider_recomend = true;} else {slider_recomend = false;}

				var slider_more = YS.settings.productQuick.CS_theme_prod_more;
				if (slider_more == "slider" || slider_more == "twirl") {slider_more = true;} else {slider_more = false;}
				
				data["slider_recomend"] = slider_recomend;
				data["slider_more"] = slider_more;
				data["boxLink_recomend"] = false;
				data["boxLink_more"] = false;
				
				if (YS.settings.productQuick.CS_theme_prod_recomend == "boxed" || YS.device.isMobile) data["boxLink_recomend"] = true;
				if (YS.settings.productQuick.CS_theme_prod_more == "boxed" || YS.device.isMobile) data["boxLink_more"] = true;
			
				return $(YS.template.product(data));
			}
		}
    };
	
}(site));
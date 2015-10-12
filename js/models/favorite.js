site.models.favorite = (function(YS){

    return {
	
		get: function(){
		
			var data;
			
			if (YS.device.isLocalStorage){
				data = sessionStorage["YS__favorite"];
			}
			else {
				data = $.cookie('YS__favorite');
			}
			
			if (typeof data === "string") return JSON.parse(data);
			
		},
		has: function(id){
			
			if (id){
			
				if (!YS.storage.productsFavorite){
					YS.storage.productsFavorite = this.get();
				}
				if (YS.storage.productsFavorite && YS.storage.productsFavorite.length){
				
					var hasItem = false;
				
					for (var i = 0, item; item = YS.storage.productsFavorite[i++];) {
						if (item["id"] == id) hasItem = true;
					}
					
					return hasItem;
				}
				else {
					return false;
				}
			}
		},
		count: function(){
			
			var data = this.get();
			
			if (data && data.length){
				return data.length;
			}
			else {
				return 0;
			}
		},
		set: function(id){
		
			if (id){
			
				var data = [];
			
				if (YS.device.isLocalStorage){
					if (typeof sessionStorage["YS__favorite"] === "string") data = JSON.parse(sessionStorage["YS__favorite"]);
				}
				else {
					if (typeof $.cookie('YS__favorite') === "string") data = JSON.parse($.cookie('YS__favorite'));
				}
				
				var notDouble = true;
				
				if (data && data.length){
					
					for (var i = 0, item; item = data[i++];) {
						if (item["id"] == id) notDouble = false;
					}
				}
				if (notDouble){
				
					var item = YS.models.product.getProduct(id, true);
					
					data.push({
						id: item["id"],
						gender: item["gender"],
						img: item[YS.settings.products.img_lite],
						price: item["price"]				
					});
					
					YS.storage.productsFavorite = data;
				}
				
				if (YS.device.isLocalStorage){	
					sessionStorage["YS__favorite"] = JSON.stringify(data);
				}
				else {
					$.cookie('YS__favorite', JSON.stringify(data), {path: '/'});
				}
			}
		},
		remove: function(id){
		
			if (id){
			
				var items = this.get(),
					data = [];
					
				if (items && items.length){
				
					for (var i = 0, item; item = items[i++];) {
						if (item["id"] != id) data.push(item);
					}	
			
					if (YS.device.isLocalStorage){
						sessionStorage["YS__favorite"] = JSON.stringify(data);
					}
					else {
						$.cookie('YS__favorite', JSON.stringify(data), {path: '/'});
					}
					
					YS.storage.productsFavorite = data;
				}
			}
		}
    };
	
}(site));
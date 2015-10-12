site.models.visited = (function(YS){

    return {
	
		get: function(){
		
			var data;
		
			if (YS.device.isLocalStorage){
				data = sessionStorage['YS__products__visited'];
			}
			else {
				data = $.cookie('YS__products__visited');
			}
			
			if (typeof data === "string") return JSON.parse(data);
			
		},
		set: function(data){
		
			if (YS.device.isLocalStorage){
				sessionStorage['YS__products__visited'] = JSON.stringify(data);
			}
			else {
				$.cookie('YS__products__visited', JSON.stringify(data), {path: '/'})
			}
		},
		last: function(data){
		
			if (data){
				YS.storage.lastProductVisited = {
					id: data["id"],
					gender: data["gender"],
					img: data[YS.settings.products.img_lite],
					price: data["price"]
				};
			}
		}	
    };
	
}(site));
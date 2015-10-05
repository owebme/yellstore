site.models.products = (function(YS){

    return {
	
		setGender: function(gender){
		
			if (gender){
			
				gender = gender.replace(/\//g, "");
			
				if (YS.device.isLocalStorage){
					sessionStorage["YS__gender"] = gender;
				}
				else {
					$.cookie('YS__gender', gender, {path: '/'});
				}
			}
		},
		getGender: function(){
			
			if (YS.device.isLocalStorage){
				return sessionStorage["YS__gender"];
			}
			else {
				return $.cookie('YS__gender');
			}
		},
		setView: function(view){
		
			if (view){
			
				if (YS.device.isLocalStorage){
					sessionStorage["YS__view"] = view;
				}
				else {
					$.cookie('YS__view', view, {path: '/'});
				}
			}
		},
		getView: function(){
		
			var view;
			
			if (YS.device.isLocalStorage){
				view = sessionStorage["YS__view"];
			}
			else {
				view = $.cookie('YS__view');
			}
			if (!view) view = "view1";
			
			return view;
		},		
		getProducts: function(category, page, callback){
		
			var items = this.items(),
				size = items.length,
				gender = this.getGender(),
				data = [],	
				limit = 28;
				
			for (var i = 0; i < size; i++) {
				if (items[i].gender == gender) {
					items[i]["alias"] = YS.plugins.translit(items[i]["title"]);
					items[i]["price"] = YS.plugins.convertPrice(items[i]["price"]);
					items[i]["price_old"] = YS.plugins.convertPrice(items[i]["price_old"]);
					data.push(items[i]);
				}
			}
			
			if (category){
				data = _.shuffle(data);
			}
			data = _.first(data, limit);
			
			if (callback && typeof callback === "function") {
				callback(data);
			}
			return data;
		},	
		cachedImages: function(id, url){

			if (YS.device.isLocalStorage){
			
				if (sessionStorage["cached__image" + id] == url){
					return true;
				}
				else {
					sessionStorage["cached__image" + id] = url;
					return false;
				}
			}
			else {
				return false;
			}
		},	
		prepare: function(data){
			var _this = this;
		
			if (data && typeof data === 'object'){
			
				return $(YS.template.products({
					"path": YS.settings.products.path,
					"view": _this.getView(),
					"product": data
				}));
			}
		},
		items: function(){
		
			return [
				{
					"id": "321",
					"alias": "321",
					"gender": "man", 
					"title": "Куртка",
					"brand": "Ferrari",
					"price": "7915",
					"price_old": "10289",
					"img1": "321_1",
					"img2": "321_2",
					"img3": "321_3",
					"img4": "321_4"
				},{
					"id": "320",
					"alias": "320",
					"gender": "man", 
					"title": "Куртка",
					"brand": "Ferrari",
					"price": "7915",
					"price_old": "10289",
					"img1": "320_1",
					"img2": "320_2",
					"img3": "320_3",
					"img4": "320_4"
				},{
					"id": "3897",
					"alias": "3897",
					"gender": "man", 
					"title": "Куртка пуховая",
					"brand": "Realto",
					"price": "2887",
					"price_old": "3753",
					"img1": "3897_1",
					"img2": "3897_2",
					"img3": "3897_3",
					"img4": "3897_4"
				},{
					"id": "3937",
					"alias": "3937",
					"gender": "man", 
					"title": "Куртка утепленная",
					"brand": "Realto",
					"price": "4500",
					"price_old": "5850",
					"img1": "3937_1",
					"img2": "3937_2",
					"img3": "3937_3",
					"img4": "3937_4"
				},{
					"id": "3935",
					"alias": "3935",
					"gender": "man", 
					"title": "Куртка пуховая",
					"brand": "Realto",
					"price": "3600",
					"price_old": "4680",
					"img1": "3935_1",
					"img2": "3935_2",
					"img3": "3935_3",
					"img4": "3935_4"
				},{
					"id": "3895",
					"alias": "3895",
					"gender": "man", 
					"title": "Куртка пуховая",
					"brand": "Realto",
					"price": "3441",
					"price_old": "4473",
					"img1": "3895_1",
					"img2": "3895_2",
					"img3": "3895_3",
					"img4": "3895_4"
				},{
					"id": "4115",
					"alias": "4115",
					"gender": "man", 
					"title": "Куртка мужская 3/4",
					"brand": "Top Secret",
					"price": "2996",
					"price_old": "3894",
					"img1": "4115_1",
					"img2": "4115_2",
					"img3": "4115_3",
					"img4": "4115_4"
				},{
					"id": "3898",
					"alias": "3898",
					"gender": "man", 
					"title": "Куртка пуховая",
					"brand": "Realto",
					"price": "2886",
					"price_old": "3751",
					"img1": "3898_1",
					"img2": "3898_2",
					"img3": "3898_3",
					"img4": "3898_4"
				},{
					"id": "5811",
					"alias": "5811",
					"gender": "man", 
					"title": "Куртка",
					"brand": "ALFRED MULLER",
					"price": "13499",
					"price_old": "",
					"img1": "5811_1",
					"img2": "5811_2",
					"img3": "5811_3",
					"img4": "5811_4"
				},{
					"id": "5810",
					"alias": "5810",
					"gender": "man", 
					"title": "Куртка",
					"brand": "ALFRED MULLER",
					"price": "13499",
					"price_old": "",
					"img1": "5810_1",
					"img2": "5810_2",
					"img3": "5810_3",
					"img4": "5810_4"
				},{
					"id": "127",
					"alias": "127",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Van Cliff",
					"price": "4320",
					"price_old": "5616",
					"img1": "127_1",
					"img2": "127_2",
					"img3": "127_3",
					"img4": "127_4"
				},{
					"id": "135",
					"alias": "135",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Forremann",
					"price": "8480",
					"price_old": "11024",
					"img1": "135_1",
					"img2": "135_2",
					"img3": "135_3",
					"img4": "135_4"
				},{
					"id": "129",
					"alias": "129",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Forremann",
					"price": "9120",
					"price_old": "11856",
					"img1": "129_1",
					"img2": "129_2",
					"img3": "129_3",
					"img4": "129_4"
				},{
					"id": "131",
					"alias": "131",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Forremann",
					"price": "9120",
					"price_old": "11856",
					"img1": "131_1",
					"img2": "131_2",
					"img3": "131_3",
					"img4": "131_4"
				},{
					"id": "4078",
					"alias": "4078",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Top Secret",
					"price": "2916",
					"price_old": "3790",
					"img1": "4078_1",
					"img2": "4078_2",
					"img3": "4078_3",
					"img4": "4078_4"
				},{
					"id": "3974",
					"alias": "3974",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Top Secret",
					"price": "2110",
					"price_old": "2743",
					"img1": "3974_1",
					"img2": "3974_2",
					"img3": "3974_3",
					"img4": "3974_4"
				},{
					"id": "3977",
					"alias": "3977",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Top Secret",
					"price": "2760",
					"price_old": "3588",
					"img1": "3977_1",
					"img2": "3977_2",
					"img3": "3977_3",
					"img4": "3977_4"
				},{
					"id": "3978",
					"alias": "3978",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Top Secret",
					"price": "2640",
					"price_old": "3432",
					"img1": "3978_1",
					"img2": "3978_2",
					"img3": "3978_3",
					"img4": "3978_4"
				},{
					"id": "3979",
					"alias": "3979",
					"gender": "man", 
					"title": "Пиджак",
					"brand": "Top Secret",
					"price": "2640",
					"price_old": "3432",
					"img1": "3979_1",
					"img2": "3979_2",
					"img3": "3979_3",
					"img4": "3979_4"
				},{
					"id": "342",
					"alias": "342",
					"gender": "man", 
					"title": "Жакет",
					"brand": "Ferrari",
					"price": "7535",
					"price_old": "9795",
					"img1": "342_1",
					"img2": "342_2",
					"img3": "342_3",
					"img4": "342_4"
				},{
					"id": "814",
					"alias": "814",
					"gender": "man", 
					"title": "Футболка",
					"brand": "ТОДОМОДА",
					"price": "550",
					"price_old": "",
					"img1": "814_1",
					"img2": "814_2",
					"img3": "814_3",
					"img4": "814_4"
				},{
					"id": "3560",
					"alias": "3560",
					"gender": "man", 
					"title": "Кардиган",
					"brand": "Katasonov",
					"price": "1969",
					"price_old": "2559",
					"img1": "3560_1",
					"img2": "3560_2",
					"img3": "3560_3",
					"img4": "3560_4"
				},{
					"id": "3544",
					"alias": "3544",
					"gender": "man", 
					"title": "Водолазка мужская",
					"brand": "Katasonov",
					"price": "1497",
					"price_old": "1946",
					"img1": "3544_1",
					"img2": "3544_2",
					"img3": "3544_3",
					"img4": "3544_4"
				},{
					"id": "3561",
					"alias": "3561",
					"gender": "man", 
					"title": "Кардиган мужской",
					"brand": "Katasonov",
					"price": "1969",
					"price_old": "2559",
					"img1": "3561_1",
					"img2": "3561_2",
					"img3": "3561_3",
					"img4": "3561_4"
				},{
					"id": "3539",
					"alias": "3539",
					"gender": "man", 
					"title": "Водолазка мужская",
					"brand": "Katasonov",
					"price": "1497",
					"price_old": "1946",
					"img1": "3539_1",
					"img2": "3539_2",
					"img3": "3539_3",
					"img4": "3539_4"
				},{
					"id": "3541",
					"alias": "3541",
					"gender": "man", 
					"title": "Водолазка мужская",
					"brand": "Katasonov",
					"price": "1497",
					"price_old": "1946",
					"img1": "3541_1",
					"img2": "3541_2",
					"img3": "3541_3",
					"img4": "3541_4"
				},{
					"id": "3563",
					"alias": "3563",
					"gender": "man", 
					"title": "Джемпер мужской",
					"brand": "Katasonov",
					"price": "2050",
					"price_old": "2665",
					"img1": "3563_1",
					"img2": "3563_2",
					"img3": "3563_3",
					"img4": "3563_4"
				},{
					"id": "302",
					"alias": "302",
					"gender": "man", 
					"title": "Футболка",
					"brand": "Ferrari",
					"price": "2805",
					"price_old": "3646",
					"img1": "302_1",
					"img2": "302_2",
					"img3": "302_3",
					"img4": "302_4"
				},{
					"id": "3551",
					"alias": "3551",
					"gender": "man", 
					"title": "Джемпер мужской",
					"brand": "Katasonov",
					"price": "1573",
					"price_old": "1998",
					"img1": "3551_1",
					"img2": "3551_2",
					"img3": "3551_3",
					"img4": "3551_4"
				},{
					"id": "3538",
					"alias": "3538",
					"gender": "man", 
					"title": "Водолазка мужская",
					"brand": "Katasonov",
					"price": "1497",
					"price_old": "1946",
					"img1": "3538_1",
					"img2": "3538_2",
					"img3": "3538_3",
					"img4": "3538_4"
				},{
					"id": "5814",
					"alias": "5814",
					"gender": "man", 
					"title": "Сорочка",
					"brand": "ALFRED MULLER",
					"price": "4299",
					"price_old": "",
					"img1": "5814_1",
					"img2": "5814_2",
					"img3": "5814_3",
					"img4": "5814_4"
				},{
					"id": "4023",
					"alias": "4023",
					"gender": "man", 
					"title": "Свитер мужской",
					"brand": "Top Secret",
					"price": "1200",
					"price_old": "1560",
					"img1": "4023_1",
					"img2": "4023_2",
					"img3": "4023_3",
					"img4": "4023_4"
				},{
					"id": "3533",
					"alias": "3533",
					"gender": "man", 
					"title": "Джемпер мужской",
					"brand": "Katasonov",
					"price": "1785",
					"price_old": "2320",
					"img1": "3533_1",
					"img2": "3533_2",
					"img3": "3533_3",
					"img4": "3533_4"
				},{
					"id": "3530",
					"alias": "3530",
					"gender": "man", 
					"title": "Джемпер мужской",
					"brand": "Katasonov",
					"price": "1785",
					"price_old": "2320",
					"img1": "3530_1",
					"img2": "3530_2",
					"img3": "3530_3",
					"img4": "3530_4"
				},{
					"id": "3910",
					"alias": "3910",
					"gender": "man", 
					"title": "Свитер мужской",
					"brand": "Realto",
					"price": "1139",
					"price_old": "1481",
					"img1": "3910_1",
					"img2": "3910_2",
					"img3": "3910_3",
					"img4": "3910_4"
				},{
					"id": "4012",
					"alias": "4012",
					"gender": "man", 
					"title": "Свитер мужской",
					"brand": "Top Secret",
					"price": "1320",
					"price_old": "1716",
					"img1": "4012_1",
					"img2": "4012_2",
					"img3": "4012_3",
					"img4": "4012_4"
				},{
					"id": "5638",
					"alias": "5638",
					"gender": "man", 
					"title": "Ветровка мужская",
					"brand": "Ultra Moda",
					"price": "1799",
					"price_old": "",
					"img1": "5638_1",
					"img2": "5638_2",
					"img3": "5638_3",
					"img4": "5638_4"
				},{
					"id": "5650",
					"alias": "5650",
					"gender": "man", 
					"title": "Футболка мужская",
					"brand": "Realto",
					"price": "799",
					"price_old": "",
					"img1": "5650_1",
					"img2": "5650_2",
					"img3": "5650_3",
					"img4": "5650_4"
				},{
					"id": "4020",
					"alias": "4020",
					"gender": "man", 
					"title": "Толстовка мужская",
					"brand": "Top Secret",
					"price": "1480",
					"price_old": "1924",
					"img1": "4020_1",
					"img2": "4020_2",
					"img3": "4020_3",
					"img4": "4020_4"
				},{
					"id": "5867",
					"alias": "5867",
					"gender": "man", 
					"title": "Футболка",
					"brand": "GREG HORMAN",
					"price": "2299",
					"price_old": "",
					"img1": "5867_1",
					"img2": "5867_2",
					"img3": "5867_3",
					"img4": "5867_4"
				},{
					"id": "136",
					"alias": "136",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Anna Chapman",
					"price": "12599",
					"price_old": "",
					"img1": "136_1",
					"img2": "136_2",
					"img3": "136_3",
					"img4": "136_4"
				},{
					"id": "1377",
					"alias": "1377",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Indigira",
					"price": "3199",
					"price_old": YS.plugins.convertPrice("3999"),
					"img1": "1377_1",
					"img2": "1377_2",
					"img3": "1377_3",
					"img4": "1377_4"
				},{
					"id": "4612",
					"alias": "4612",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Ducky Style",
					"price": "9500",
					"price_old": YS.plugins.convertPrice("12350"),
					"img1": "4612_1",
					"img2": "4612_2",
					"img3": "4612_3",
					"img4": "4612_4"
				},{
					"id": "1990",
					"alias": "1990",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "LuAnn",
					"price": "7599",
					"price_old": "",
					"img1": "1990_1",
					"img2": "1990_2",
					"img3": "1990_3",
					"img4": "1990_4"
				},{
					"id": "1047",
					"alias": "1047",
					"gender": "woman", 
					"title": "Куртка",
					"brand": "Remix",
					"price": "996",
					"price_old": "",
					"img1": "1047_1",
					"img2": "1047_2",
					"img3": "1047_3",
					"img4": "1047_4"
				},{
					"id": "183",
					"alias": "183",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Gloss",
					"price": "4499",
					"price_old": "",
					"img1": "183_1",
					"img2": "183_2",
					"img3": "183_3",
					"img4": "183_4"
				},{
					"id": "924",
					"alias": "924",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Argent",
					"price": "5540",
					"price_old": "",
					"img1": "924_1",
					"img2": "924_2",
					"img3": "924_3",
					"img4": "924_4"
				},{
					"id": "1079",
					"alias": "1079",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Remix",
					"price": "1851",
					"price_old": "",
					"img1": "1079_1",
					"img2": "1079_2",
					"img3": "1079_3",
					"img4": "1079_4"
				},{
					"id": "4089",
					"alias": "4089",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Top Secret",
					"price": "2400",
					"price_old": "",
					"img1": "4089_1",
					"img2": "4089_2",
					"img3": "4089_3",
					"img4": "4089_4"
				},{
					"id": "932",
					"alias": "932",
					"gender": "woman", 
					"title": "Платье женское",
					"brand": "Argent",
					"price": "3500",
					"price_old": "",
					"img1": "932_1",
					"img2": "932_2",
					"img3": "932_3",
					"img4": "932_4"
				},{
					"id": "942",
					"alias": "942",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Argent",
					"price": "4600",
					"price_old": "",
					"img1": "942_1",
					"img2": "942_2",
					"img3": "942_3",
					"img4": "942_4"
				},{
					"id": "3603",
					"alias": "3603",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Imago",
					"price": "12265",
					"price_old": "",
					"img1": "3603_1",
					"img2": "3603_2",
					"img3": "3603_3",
					"img4": "3603_4"
				},{
					"id": "925",
					"alias": "925",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Argent",
					"price": "3650",
					"price_old": "",
					"img1": "925_1",
					"img2": "925_2",
					"img3": "925_3",
					"img4": "925_4"
				},{
					"id": "4995",
					"alias": "4995",
					"gender": "woman", 
					"title": "Джемпер",
					"brand": "Alison Sheri",
					"price": "2599",
					"price_old": "",
					"img1": "4995_1",
					"img2": "4995_2",
					"img3": "4995_3",
					"img4": "4995_4"
				},{
					"id": "4613",
					"alias": "4613",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Ducky Style",
					"price": "9500",
					"price_old": "",
					"img1": "4613_1",
					"img2": "4613_2",
					"img3": "4613_3",
					"img4": "4613_4"
				},{
					"id": "3648",
					"alias": "3648",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Imago",
					"price": "10620",
					"price_old": "",
					"img1": "3648_1",
					"img2": "3648_2",
					"img3": "3648_3",
					"img4": "3648_4"
				},{
					"id": "4124",
					"alias": "4124",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Top Secret",
					"price": "3250",
					"price_old": "",
					"img1": "4124_1",
					"img2": "4124_2",
					"img3": "4124_3",
					"img4": "4124_4"
				},{
					"id": "1749",
					"alias": "1749",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Xarizmas",
					"price": "7258",
					"price_old": "",
					"img1": "1749_1",
					"img2": "1749_2",
					"img3": "1749_3",
					"img4": "1749_4"
				},{
					"id": "5161",
					"alias": "5161",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Xarizmas",
					"price": "3013",
					"price_old": "",
					"img1": "5161_1",
					"img2": "5161_2",
					"img3": "5161_3",
					"img4": "5161_4"
				},{
					"id": "4977",
					"alias": "4977",
					"gender": "woman", 
					"title": "Джемпер",
					"brand": "Alison Sheri",
					"price": "2599",
					"price_old": "",
					"img1": "4977_1",
					"img2": "4977_2",
					"img3": "4977_3",
					"img4": "4977_4"
				},{
					"id": "1100",
					"alias": "1100",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Remix",
					"price": "2652",
					"price_old": "",
					"img1": "1100_1",
					"img2": "1100_2",
					"img3": "1100_3",
					"img4": "1100_4"
				},{
					"id": "4193",
					"alias": "4193",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Nor Denmark",
					"price": "4960",
					"price_old": "",
					"img1": "4193_1",
					"img2": "4193_2",
					"img3": "4193_3",
					"img4": "4193_4"
				},{
					"id": "180",
					"alias": "180",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Gloss",
					"price": "5699",
					"price_old": "",
					"img1": "180_1",
					"img2": "180_2",
					"img3": "180_3",
					"img4": "180_4"
				},{
					"id": "4614",
					"alias": "4614",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Ducky Style",
					"price": "7500",
					"price_old": "",
					"img1": "4614_1",
					"img2": "4614_2",
					"img3": "4614_3",
					"img4": "4614_4"
				},{
					"id": "138",
					"alias": "138",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Anna Chapman",
					"price": "12599",
					"price_old": "",
					"img1": "138_1",
					"img2": "138_2",
					"img3": "138_3",
					"img4": "138_4"
				},{
					"id": "4616",
					"alias": "4616",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Ducky Style",
					"price": "9500",
					"price_old": "",
					"img1": "4616_1",
					"img2": "4616_2",
					"img3": "4616_3",
					"img4": "4616_4"
				},{
					"id": "1721",
					"alias": "1721",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Xarizmas",
					"price": "6350",
					"price_old": "",
					"img1": "1721_1",
					"img2": "1721_2",
					"img3": "1721_3",
					"img4": "1721_4"
				},{
					"id": "1048",
					"alias": "1048",
					"gender": "woman", 
					"title": "Куртка",
					"brand": "Remix",
					"price": "996",
					"price_old": "",
					"img1": "1048_1",
					"img2": "1048_2",
					"img3": "1048_3",
					"img4": "1048_4"
				},{
					"id": "5187",
					"alias": "5187",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Xarizmas",
					"price": "9812",
					"price_old": "",
					"img1": "5187_1",
					"img2": "5187_2",
					"img3": "5187_3",
					"img4": "5187_4"
				},{
					"id": "1279",
					"alias": "1279",
					"gender": "woman", 
					"title": "Водолазка",
					"brand": "Elena Shipilova",
					"price": "1399",
					"price_old": YS.plugins.convertPrice("1799"),
					"img1": "1279_1",
					"img2": "1279_2",
					"img3": "1279_3",
					"img4": "1279_4"
				},{
					"id": "1987",
					"alias": "1987",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "LuAnn",
					"price": "9399",
					"price_old": "",
					"img1": "1987_1",
					"img2": "1987_2",
					"img3": "1987_3",
					"img4": "1987_4"
				},{
					"id": "705",
					"alias": "705",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Anna Chapman",
					"price": "4599",
					"price_old": "",
					"img1": "705_1",
					"img2": "705_2",
					"img3": "705_3",
					"img4": "705_4"
				},{
					"id": "4275",
					"alias": "4275",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "LuAnn",
					"price": "7599",
					"price_old": "",
					"img1": "4275_1",
					"img2": "4275_2",
					"img3": "4275_3",
					"img4": "4275_4"
				},{
					"id": "934",
					"alias": "934",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Argent",
					"price": "2800",
					"price_old": "",
					"img1": "934_1",
					"img2": "934_2",
					"img3": "934_3",
					"img4": "934_4"
				},{
					"id": "4580",
					"alias": "4580",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Ducky Style",
					"price": "3200",
					"price_old": "",
					"img1": "4580_1",
					"img2": "4580_2",
					"img3": "4580_3",
					"img4": "4580_4"
				},{
					"id": "1068",
					"alias": "1068",
					"gender": "woman", 
					"title": "Платье",
					"brand": "Remix",
					"price": "1906",
					"price_old": "",
					"img1": "1068_1",
					"img2": "1068_2",
					"img3": "1068_3",
					"img4": "1068_4"
				},{
					"id": "4130",
					"alias": "4130",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Top Secret",
					"price": "3250",
					"price_old": "",
					"img1": "4130_1",
					"img2": "4130_2",
					"img3": "4130_3",
					"img4": "4130_4"
				},{
					"id": "5005",
					"alias": "5005",
					"gender": "woman", 
					"title": "Пальто",
					"brand": "Alison Sheri",
					"price": "4899",
					"price_old": "",
					"img1": "5005_1",
					"img2": "5005_2",
					"img3": "5005_3",
					"img4": "5005_4"
				},{
					"id": "5047",
					"alias": "5047",
					"gender": "woman", 
					"title": "Куртка",
					"brand": "Rene Derhy",
					"price": "2899",
					"price_old": "",
					"img1": "5047_1",
					"img2": "5047_2",
					"img3": "5047_3",
					"img4": "5047_4"
				},{
					"id": "5048",
					"alias": "5048",
					"gender": "woman", 
					"title": "Куртка",
					"brand": "Rene Derhy",
					"price": "2899",
					"price_old": "",
					"img1": "5048_1",
					"img2": "5048_2",
					"img3": "5048_3",
					"img4": "5048_4"
				},{
					"id": "5092",
					"alias": "5092",
					"gender": "woman", 
					"title": "Куртка",
					"brand": "Iconoclast",
					"price": "11199",
					"price_old": "",
					"img1": "5092_1",
					"img2": "5092_2",
					"img3": "5092_3",
					"img4": "5092_4"
				},{
					"id": "4050",
					"alias": "4050",
					"gender": "woman", 
					"title": "Куртка женская",
					"brand": "Drywash",
					"price": "1750",
					"price_old": "",
					"img1": "4050_1",
					"img2": "4050_2",
					"img3": "4050_3",
					"img4": "4050_4"
				},{
					"id": "3938",
					"alias": "3938",
					"gender": "woman", 
					"title": "Куртка пуховая",
					"brand": "Ultra Moda",
					"price": "2800",
					"price_old": YS.plugins.convertPrice("3640"),
					"img1": "3938_1",
					"img2": "3938_2",
					"img3": "3938_3",
					"img4": "3938_4"
				},{
					"id": "4119",
					"alias": "4119",
					"gender": "woman", 
					"title": "Куртка женская",
					"brand": "Top Secret",
					"price": "2600",
					"price_old": "",
					"img1": "4119_1",
					"img2": "4119_2",
					"img3": "4119_3",
					"img4": "4119_4"
				},{
					"id": "5093",
					"alias": "5093",
					"gender": "woman", 
					"title": "Куртка",
					"brand": "Iconoclast",
					"price": "5799",
					"price_old": "",
					"img1": "5093_1",
					"img2": "5093_2",
					"img3": "5093_3",
					"img4": "5093_4"
				},{
					"id": "5084",
					"alias": "5084",
					"gender": "woman", 
					"title": "Куртка",
					"brand": "Iconoclast",
					"price": "3799",
					"price_old": "",
					"img1": "5084_1",
					"img2": "5084_2",
					"img3": "5084_3",
					"img4": "5084_4"
				}
			];
		}	
    };
	
}(site));
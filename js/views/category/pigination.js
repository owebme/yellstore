site.views.pigination = (function(YS){

    return {
	
		init: function(pages, page){
			var _this = this;
			
			if (!YS.ui.pigination) YS.ui.pigination = $('<div class="YS__pigination"></div>');
			
			_this.build(pages, page, function(_pages){
			
				YS.ui.pigination.removeClass("YS__pigination__reload").empty().append(_pages);
				$page_content.after(YS.ui.pigination);
				
				if (YS.settings.pigination.ajax){
					YS.ui.pigination.find(".YS__page__item").on(clickEvent, function(e){
						e.preventDefault();
						
						if (!this.className.match(/active/)){
						
							YS.ui.pigination.addClass("YS__pigination__reload");
							YS.settings.pigination.callback({
								"page": this.getAttribute("data-page"),
								"alias": this.getAttribute("href")
							});
						}
					});
				}
			});
		},
		build: function(_pages, page, callback){

			if (!page) page = 1;
			else page = page*1;
		
			var pages="", url_next;
				quantity = _pages.length,
				range = YS.settings.pigination.range,
				from = parseInt(page - parseInt(range/2)),
				to = parseInt(page + parseInt(range/2));
				
			if (quantity == 1) return false;
			
			if (from < 0) from = 0;
			if (to > quantity) to = quantity + 1;
				
			if ((page + parseInt(range/2)) > quantity){
				from += quantity - (page + parseInt(range/2));
			}
			else if ((to - from) < (range + 1)){
				to = from + range + 1;
			}
			
			for (var i = 0, item; item = _pages[i++];) {
			
				var num = item["page"],
					url = item["alias"];

				if (from > 0 && i == 1){pages += '<a href="'+ url +'" data-page="1" class="YS__page__item YS__page__item__prev">к началу</a>';}
				if (i > from && i < to){
					pages += '<a href="'+ url +'" data-page="'+ num +'" class="YS__page__item'+ (num == page ?' YS__page__item--active':'') +'">'+ num +'</a>';
				}
				if (i == (page + 1)) {url_next = url;}
				if (i == to){pages += '<a href="'+ url_next +'" data-page="'+ (page + 1) +'" class="YS__page__item YS__page__item__next">далее</a>';}
			}
			
			if (callback && typeof callback === 'function') callback(pages);
		}
	};
	
})(site);
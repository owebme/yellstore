site.views.breadcrumbs = (function(YS){

    return {
	
		init: function(){
		
			YS.ui.breadcrumbs = $(".breadcrumbs");
			YS.ui.breadcrumbsPath = YS.ui.breadcrumbs.find(".breadcrumbs__section__path");
			YS.ui.breadcrumbsTitle = YS.ui.breadcrumbs.find(".breadcrumbs__item__title");
			YS.ui.breadcrumbsResult = YS.ui.breadcrumbs.find(".breadcrumbs__section__result");
			
			this.update();
		},
		update: function(json){
			var _this = this;
		
			if (typeof json === "string"){
			
				var data = JSON.parse(json);
					count = 0,
					breadcrumbs = '<div class="breadcrumbs__item__home" itemtype="http://data-vocabulary.org/Breadcrumb" itemscope=""><a class="breadcrumbs__item__home__link breadcrumbs__item__link" href="/" itemprop="url"><span itemprop="title">Главная</span></a></div>';
					
				YS.ui.breadcrumbsPath.find(".breadcrumbs__item:last").addClass("breadcrumbs__item--change");

				if (data.length){
					for (var i = 0, item; item = data[i++];) {
						count++;
						var hide = true;
						if (count == data.length){
							breadcrumbs += '<div class="breadcrumbs__item breadcrumbs__item--hide"><span class="breadcrumbs__item__title">'+ item["title"] +'</span></div>';
						}
						else {
							YS.ui.breadcrumbsPath.find(".breadcrumbs__item:nth-child(" + (count + 1) + ")").each(function(){
								var $elem = $(this),
									$link = $elem.find(".breadcrumbs__item__link");
								if ($link.attr("href") != item["url"]) {$elem.addClass("breadcrumbs__item--change");}
							});
							
							if (YS.ui.breadcrumbsPath.find(".breadcrumbs__item > .breadcrumbs__item__link[href='"+ item["url"] +"']").length) hide = false;
							breadcrumbs += '<div class="breadcrumbs__item' + (hide ?' breadcrumbs__item--hide' : '') + '" itemtype="http://data-vocabulary.org/Breadcrumb" itemscope=""><a class="breadcrumbs__item__link" href="'+ item["url"] +'" itemprop="url"><span itemprop="title">'+ item["title"] +'</span></a></div>';
						}
					}
					YS.plugins.animElems(YS.ui.breadcrumbsPath.find(".breadcrumbs__item--change"), "breadcrumbs__item--hide");
					YS.ui.breadcrumbsPath.on(prefixed.transition + "end", function(){
						YS.ui.breadcrumbsPath.off(prefixed.transition + "end");
						YS.ui.breadcrumbsPath[0].innerHTML = breadcrumbs;
						setTimeout(function(){
							YS.plugins.animElems(YS.ui.breadcrumbsPath.find(".breadcrumbs__item--hide"), "breadcrumbs__item--hide");
							_this.path();
						}, 20);
					});
				}
			}
		},
		path: function(){
			if (YS.settings.breadcrumbsMenu.ajax){
				YS.ui.breadcrumbsPath.find(".breadcrumbs__item__link:not(.breadcrumbs__item__home__link)").on("click", function(e){
					e.preventDefault();
					
					var $link = $(this),
						$item = $link.parent(),
						$nextAll = $item.nextAll();
						
					YS.settings.breadcrumbsMenu.callback($link[0], function(){
						YS.plugins.animElems($nextAll, "breadcrumbs__item--hide");
						$item.replaceWith('<div class="breadcrumbs__item"><span class="breadcrumbs__item__title">'+ $link.text() +'</span></div>');
						YS.ui.breadcrumbsPath.on(prefixed.transition + "end", function(){
							YS.ui.breadcrumbsPath.off(prefixed.transition + "end");
							$nextAll.remove();
						});
					});
				});
			}			
		},
		result: function(text){
			YS.ui.breadcrumbsResult.html(text);
			YS.ui.breadcrumbsPath.removeClass("breadcrumbs__section--active");
			YS.ui.breadcrumbsResult.addClass("breadcrumbs__section--active");
		},
		reset: function(){
			YS.ui.breadcrumbsPath.addClass("breadcrumbs__section--active");
			YS.ui.breadcrumbsResult.removeClass("breadcrumbs__section--active");			
		}
	};
	
})(site);
site.views.breadcrumbs = (function(YS){

    return {
	
		init: function(category){
		
			if (!YS.ui.breadcrumbs){
			
				YS.ui.breadcrumbs =  YS.ui.categoryPanel.find(".breadcrumbs");
				YS.ui.breadcrumbsPath = YS.ui.breadcrumbs.find(".breadcrumbs__section__path");
				YS.ui.breadcrumbsResult = YS.ui.breadcrumbs.find(".breadcrumbs__section__result");
				
				this.build(category);
			}
		},
		build: function(category){
		
			this.update([
				{"id": YS.plugins.rand(2000, 9999), "title": "Женщинам", "alias": "/c/woman/"},
				{"id": YS.plugins.rand(2000, 9999), "title": "Женская одежда", "alias": "/c/woman/3427/zhenskaya-odezhda"}
			]);			
		
		},
		update: function(data){
			var _this = this;
		
			if (data){
			
				if (typeof data === "object"){
			
					var count = 0,
						breadcrumbs = '<div class="breadcrumbs__item__home" itemtype="http://data-vocabulary.org/Breadcrumb" itemscope=""><a class="breadcrumbs__item__home__link breadcrumbs__item__link" href="/" itemprop="url"><span itemprop="title">Главная</span></a></div>';
						
					var $item = YS.ui.breadcrumbsPath.find(".breadcrumbs__item:last");
					
					if ($item.length) $item.addClass("breadcrumbs__item--change");

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
									if ($link.attr("href") != item["alias"]) {$elem.addClass("breadcrumbs__item--change");}
								});
								
								if (YS.ui.breadcrumbsPath.find(".breadcrumbs__item > .breadcrumbs__item__link[href='"+ item["alias"] +"']").length) hide = false;
								breadcrumbs += '<div class="breadcrumbs__item' + (hide ?' breadcrumbs__item--hide' : '') + '" itemtype="http://data-vocabulary.org/Breadcrumb" itemscope=""><a class="breadcrumbs__item__link" href="'+ item["alias"] +'" data-id="'+ item["id"] +'" itemprop="url"><span itemprop="title">'+ item["title"] +'</span></a></div>';
							}
						}

						if ($item.length){
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
						else {
							YS.ui.breadcrumbsPath[0].innerHTML = breadcrumbs;
							YS.ui.breadcrumbsPath.find(".breadcrumbs__item--hide").removeClass("breadcrumbs__item--hide");
							_this.path();
						}
					}
				}
				else if (typeof data === "function"){
					data();
				}			
			}
		},
		path: function(){
			if (YS.settings.breadcrumbsMenu.ajax){
				YS.ui.breadcrumbsPath.find(".breadcrumbs__item__link:not(.breadcrumbs__item__home__link)").on(clickEvent, function(e){
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
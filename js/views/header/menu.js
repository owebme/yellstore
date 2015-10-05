site.views.headerMenu = (function(YS){

    return {
	
		init: function(){

			YS.ui.gender_menu = $(".header__gender__menu");
				
			var $menu = $(".header__menu"),
				$parents = $menu.find(".header__menu__parents__list"),
				$drop_menu = $menu.find(".header__menu__dropdown"),
				hovers = {};
				
			YS.ui.gender_menu.find("a").on(clickEvent, function(e){
			
				e.preventDefault();
				
				var $elem = $(this);
				
				if (!this.className.match(/active/)){
					var index = $elem.index();
					YS.ui.gender_menu.find(".header__gender__menu__item--active").removeClass("header__gender__menu__item--active");
					$elem.addClass("header__gender__menu__item--active");
					$menu.find(".header__menu__parents__container").attr("id", "header__menu__parents__container--level"+ (index + 1));
				}
			});
			
			if (YS.settings.headerMenu.ajax){
				$menu.find(".header__menu__parents__link, .header__menu__dropdown__link").on(clickEvent, function(e){
					e.preventDefault();
					var elem = this;
					if (elem.className.match(/header__menu__parents__link/)){
						$parents.find(".header__menu__parents__link--active").removeClass("header__menu__parents__link--active");
						$(elem).addClass("header__menu__parents__link--active");
					}
					else if (elem.className.match(/header__menu__dropdown__link/)){
						$drop_menu.find(".header__menu__dropdown__link").removeClass("header__menu__dropdown__link--active");
						$(elem).addClass("header__menu__dropdown__link--active");
					}	
					YS.settings.headerMenu.callback(elem);
				});
			}
				
			$parents.find("li").on("mouseenter", function(e){
			
				var $elem = $(this),
					$active = $drop_menu.find(".header__menu__dropdown__wrapper--active"),
					delay = 80,
					index = $elem.data("id");
					hovers.index = true;
					
				if (YS.device.isMobile) delay = 0;
			
				setTimeout(function(){
				
					if (hovers.index){
				
						var $submenu = $drop_menu.find(".header__menu__dropdown__wrapper[data-id="+ index +"]");
						
						$parents.find(".header__menu__parents__item--active").removeClass("header__menu__parents__item--active");
							
						if ($active.length) $active.removeClass("header__menu__dropdown__wrapper--active");
						
						if ($submenu.length){
							$elem.addClass("header__menu__parents__item--active");
							$submenu.addClass("header__menu__dropdown__wrapper--active");
						}
					}
					
				}, delay);
				
				$menu.off("mouseleave");
				$menu.on("mouseleave", function(){
					hovers.index = false;
					$parents.find(".header__menu__parents__item--active").removeClass("header__menu__parents__item--active");
					$drop_menu.find(".header__menu__dropdown__wrapper--active").removeClass("header__menu__dropdown__wrapper--active");
					$menu.off("mouseleave");
				});
			});
		}
	};
	
})(site);
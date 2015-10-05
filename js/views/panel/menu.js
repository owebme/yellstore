site.views.panelMenu = (function(YS){

    return {
	
		init: function(){
			var _this = this;
			
			_this.levelSpacing = 30;
			
			YS.template.init("panelMenu", function(){
			
				// Open Menu Category
				YS.ui.panel.menu.on(clickEvent, function(){
					if (!this.className.match(/active/)){
						$(this).addClass("YS__panel__menu--active");
						YS.ui.panel.self.addClass("YS__panel--active");
						YS.plugins.overlay(true);
						_this.open();
					}
					else {
						_this.close();
					}
				});			
			
				_this.menu = $(YS.template.panelMenu)[0];
				YS.views.panelMenu.title = YS.ui.panel.menu.find(".YS__panel__menu__item")[0];
				
				_this.build();
			
			});
		},
		build: function(){
			var _this = this;
		
			var tree = _this.menu, arrParents = [], objOpener = {}, html = document.createElement("div"), level = 0, id,
				items = tree.getElementsByTagName("li");
				
			tree.firstElementChild.id = "YS__tree";
			
			for (var i = 0, item; item = items[i++];) {
				if (item.parentNode.getAttribute("id") == "YS__tree"){
					arrParents.push(item.firstElementChild);
				}
				if (item.innerHTML.match(/<ul/)){
					var link = item.firstElementChild;
					var lv = YS.plugins.countLevelList(item, "ul", "YS__tree");
					id = YS.plugins.rand(((lv+1)*1000), ((lv+2)*1000));
					link.id = id;
					link.nextElementSibling.id = "YS__menu_" + id;
					link.nextElementSibling.setAttribute("data-level", lv+1);
					objOpener[id] = link;
				}
			}
			
			for (var i = 0, item; item = arrParents[i++];) {
				var id = item.id;
				
				html.innerHTML += '<li><a href="'+ item.getAttribute("href") +'"'+ (id?' class="YS__menu__opener" data-menu="'+id+'"':'') +'>'+ item.innerHTML +'</a></li>'
			}
			
			var parent_menu = '<div class="YS__menu__parent__category">'+
					'<div class="YS__menu__parent__category__item YS__menu__parent__category__item--active" id="for_woman"><span>Ж</span><em>енщинам</em></div>'+
					'<div class="YS__menu__parent__category__item" id="for_man"><span>М</span><em>ужчинам</em></div>'+
					'<div class="YS__menu__parent__category__item" id="for_child"><span>Д</span><em>етям</em></div>'+
					'<div class="YS__menu__parent__category__divider"></div>'+
				'</div>';
			
			html.innerHTML = '<div class="YS__menu__level YS__menu__parent" data-level="0">'+
				parent_menu+
				//'<div class="YS__menu__tree__title">Все категории</div>'+
				'<div class="YS__scroller">'+
					'<div class="YS__scroller__container">'+
						'<ul>'+ html.innerHTML +'</ul>'+
					'</div>'+
				'</div>';
			
			for (id in objOpener) {
			
				var item = objOpener[id];
					subMenu = _this.menu.querySelectorAll("#YS__menu_" + id + " > li"),
					subHtml = document.createElement("ul");
					
				level = subMenu[0].parentNode.getAttribute("data-level");
				
				for (var j = 0; j < subMenu.length; j++) {
					var subItem = subMenu[j].firstElementChild,
						subId = subItem.id;
						
					subHtml.innerHTML += '<li><a href="'+ subItem.getAttribute("href") +'"'+ (subId?' class="YS__menu__opener" data-menu="'+subId+'"':'') +'>'+ subItem.innerHTML +'</a></li>'
				}
					
				html.innerHTML += '<div class="YS__menu__level" data-level="'+ level +'" id="YS__menu_'+ id +'">'+
				'<div class="YS__menu__tree__title">'+ item.innerHTML +'</div>'+
				'<span class="YS__menu__back">назад</span>'+
				'<div class="YS__scroller">'+
					'<div class="YS__scroller__container">'+
						'<ul>'+ subHtml.innerHTML +'</ul>'+
					'</div>'+
				'</div>';
			}
			
			_this.menu.parentNode.removeChild(_this.menu);
				
			YS.ui.panel.menu.tree = $('<div class="YS__menu__tree"><div class="YS__menu__tree__container">'+ html.innerHTML +'</div></div>');
			YS.ui.panel.menu.container = YS.ui.panel.menu.tree.children();
			YS.ui.panel.menu.container_ = YS.ui.panel.menu.container[0];
			
			$root.append(YS.ui.panel.menu.tree);
			
			YS.ui.panel.menu.container.find(".YS__scroller").each(function(){
				var scroll = new IScroll(this, {
					mouseWheel: true
				});
				if (YS.settings.panelMenu.ajax){
					$(this).find("a:not(.YS__menu__opener)").on(clickEvent, function(e){
						e.preventDefault();
						var _link = this,
						$level = $(_link).closest(".YS__menu__level");
						if (!$level[0].getAttribute("class").match(/overlay/)){
							setTimeout(function(){
								if (!YS.plugins.fixDragMenu.action){
									YS.settings.panelMenu.callback(_link);
								}
							}, 5);
						}
					});
				}
				YS.plugins.fixDragMenu(this.firstElementChild);
			});
			
			YS.ui.panel.menu.container.find(".YS__menu__parent__category__item").on(clickEvent, function(){
				if (!this.className.match(/active/)){
					YS.ui.panel.menu.container.find(".YS__menu__parent__category__item").removeClass("YS__menu__parent__category__item--active");
					$(this).addClass("YS__menu__parent__category__item--active");
				}
			});
			
		},
		open: function(){
			var _this = this;
			
			_this.level = 0;
			
			YS.status("openMenu", true);
			YS.ui.panel.menu.tree.addClass("YS__menu__tree--active");
		
			YS.ui.panel.menu.tree.find(".YS__menu__opener").on(clickEvent, function(e){
				
				e.preventDefault();
			
				var level = YS.plugins.findParent(this, ".YS__menu__level");
				
				if (!level.getAttribute("class").match(/overlay/)){
				
					var $open = YS.ui.panel.menu.tree.find("#YS__menu_"+$(this).data("menu"));
					
					_this.level++;
					
					if (!YS.device.isMobile){
						var translateVal = _this.level * _this.levelSpacing;
						_this.setTransform( 'translateX(' + -translateVal + 'px)' );
						_this.setTransform( 'translateX(' + translateVal + 'px)' , $open[0]);
					}
					
					$open.addClass("YS__menu__level--open");
					$(level).addClass("YS__menu__level--overlay");
					
					setTimeout(function(){
						$(level).on(clickEvent, function(e){
							e.preventDefault();
							_this.back(this, $open, this);
							$(this).off("click");
							$open.find(".YS__menu__back").off("click");
						});
						$open.find(".YS__menu__back").on(clickEvent, function(e){
							e.preventDefault();							
							_this.back(level, $open, this);
							$(level).off("click");
							$(this).off("click");
						});						
					}, 100);
				}
			});
			
			if (YS.views.links){
				YS.ui.cloud_links.on(clickEvent, function(e){
					if (e.target.nodeName.toLowerCase() != "a"){
						_this.close();
					}
				});
			}
			else {
				$root.on(clickEvent, function(e){
					var id = e.target.id;
					if (id && id == "root"){
						_this.close();
					}
				});
			}	
			
			YS.plugins.frozeScroll();
			
		},
		back: function(level, open){
			var _this = this;
			
			var selectLevel = parseInt(level.getAttribute("data-level"));
			
			if ((_this.level - selectLevel) > 1){

				YS.ui.panel.menu.container.find(".YS__menu__level--open").each(function(){
					
					var _selectLevel = this.getAttribute("data-level");
					
					if (_selectLevel > selectLevel){
					
						_this.level--;
					
						$(this).off("click").removeClass("YS__menu__level--overlay").removeClass("YS__menu__level--open");
						$(this).find(".YS__menu__back").off("click");
					
						if (!YS.device.isMobile){
							var translateVal = _this.level * _this.levelSpacing;
							_this.setTransform( 'translateX(' + -translateVal + 'px)' );
							$(this).attr("style", "");
						}
					}
				});
			}
			else {
			
				_this.level--;
			
				if (!YS.device.isMobile){
					var translateVal = _this.level * _this.levelSpacing;
					_this.setTransform( 'translateX(' + -translateVal + 'px)' );
					$(open).attr("style", "");
				}
			}				
			$(level).removeClass("YS__menu__level--overlay");
			$(open).removeClass("YS__menu__level--open");
		},
		setTransform : function(val, elem){
			if (!elem){elem = YS.ui.panel.menu.container_;}
			elem.style.WebkitTransform = val;
			elem.style.transform = val;
		},		
		close: function(){
		
			YS.ui.panel.menu.tree.find(".YS__menu__level--overlay").removeClass("YS__menu__level--overlay");
		
			if (!YS.spinner) YS.plugins.overlay(false);
		
			$root.removeClass("state__openMenu");
			YS.ui.panel.self.removeClass("YS__panel--active");
			YS.ui.panel.menu.removeClass("YS__panel__menu--active");
			$root.off("click");
			
			if (YS.views.links) YS.ui.cloud_links.off("click");
			
			YS.ui.panel.menu.tree.find(".YS__menu__level, .YS__menu__opener, .YS__menu__back").off("click");
			
			YS.ui.panel.menu.container.attr("style", "");
			YS.ui.panel.menu.container.find(".YS__menu__level").attr("style", "");
			YS.ui.panel.menu.tree.find(".YS__menu__level--open").removeClass("YS__menu__level--open");
			
			YS.ui.panel.menu.tree.removeClass("YS__menu__tree--active");
			
			YS.plugins.unFrozeScroll();
			
			YS.status("openMenu", false);
		}
	};
	
})(site);
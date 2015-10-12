site.views.filter = (function(YS){

    return {
	
		init: function(){
			var _this = this;
			
			YS.ui.panel.filter_container = YS.ui.panel.filter.find(".YS__panel__filter__container");
			
			_this.build();
			
			$window.on("resize.filter", function(){
				_this.resize();
			});
		},
		build: function(){
			var _this = this;
			
			// Building 			
			YS.ui.panel.filter_container.find(".YS__filter").each(function(){
				
				var $filter = $(this),
					$item = $filter.children(),
					mode = $item.data("mode"),
					title = $item.data("title");
				
				if ($item[0].nodeName.toLowerCase() == "select"){
				
					if (mode == "multi") {
						$filter.attr("data-mode", "multi");
						$item.attr("multiple", "multiple");
					}
					
					$item.val("");
					
					var	select = "",
						name = $item.attr("name");
					
					$item.find("option").each(function(){
						var add = "";
						if (mode == "multi"){
							add += '<i class="YS__filter__select__item__checkbox"></i>';
						}
						if (this.getAttribute("data-color")){
							add += '<i class="YS__filter__select__item__color" style="background-color:'+this.getAttribute("data-color")+'"></i>';
						}
						select += '<div class="YS__filter__select__item" data-value="'+ this.getAttribute("value") +'">'+ add + this.innerHTML +'</div>';
					});
					
					select ='<i title="Сбросить фильтр" class="YS__filter__delete"></i>'+
								'<span class="YS__filter__title">'+ title +'</span>'+
								'<div class="YS__filter__value"><div class="YS__filter__value__string">'+ title +'</div></div>'+
								'<div class="YS__filter__select">'+
									'<div class="YS__filter__select__title">'+ title +'</div>'+
									'<div class="YS__filter__select__container">'+
										select +
									'</div>'+
								'</div>';
														
					$filter.prepend(select);
				}
				else if (mode == "range"){
				
					var name = $item.data("name"),
						min = $item.data("min"),
						max = $item.data("max"),
						step = $item.data("step");
					
					var slider = '<i title="Сбросить фильтр" class="YS__filter__delete"></i>'+
							'<span class="YS__filter__title">'+ title +'</span>'+
							'<div class="YS__filter__value"><div class="YS__filter__value__string">'+ title +'</div></div>'+
							'<div class="YS__filter__select YS__filter__range">'+
								'<div class="YS__filter__select__title">'+ title +'</div>'+
								'<div class="YS__filter__select__container">'+
									'<div class="YS__filter__range__slider" data-min="'+ min +'" data-max="'+ max +'"'+ (step?' data-step="'+ step +'"':'') +'></div>'+
								'</div>'+
							'</div>'+
							'<input type="hidden" class="YS__filter__'+ name +'_from" name="'+ name +'[]" value="">'+
							'<input type="hidden" class="YS__filter__'+ name +'_to" name="'+ name +'[]" value="">';
							
					$filter.data("title", title).html(slider);
					
					var $slider = $filter.find(".YS__filter__range__slider"),
						$value = $filter.find(".YS__filter__value__string");
						
					// Create Range Slider
					noUiSlider.create($slider[0], {
						start: [min, max],
						step: step,
						range: {
							'min': min,
							'max': max
						}
					});
					
					// Change Range
					$slider[0].noUiSlider.on('update', function(values, handle) {
						$slider.find(".noUi-active").html(values[handle]);
						$value.text(values[0] + " — " + values[1]);
						$filter.find(".YS__filter__"+ name +"_from").val(values[0].replace(/\s/, ""));
						$filter.find(".YS__filter__"+ name +"_to").val(values[1].replace(/\s/, ""));
						$filter.addClass("YS__filter--selected");
						YS.ui.panel.filter_apply.addClass("YS__filter__apply--active");
						_this.resize();
					});
				}
				
				$filter.attr("data-title", title).attr("data-name", name).attr("data-mode", mode);
			});
			
			YS.ui.panel.filter.find(".YS__filter__select").each(function(){
				$(this).css("margin-left", -($(this).width()/2) + "px");
			});
			
			// Open Filter Product
			YS.ui.panel.filter.find(".YS__filter__value").on(clickEvent, function(){
				var filter = this.parentNode;
				if (!filter.className.match(/active/)){
					YS.ui.panel.filter.addClass("YS__panel__filter--active");
					YS.ui.panel.self.addClass("YS__panel--active");
					_this.open(filter);
				}
				else {
					_this.close();
				}
			});
			
			// Change Select
			YS.ui.panel.filter.find(".YS__filter__select__item").on(clickEvent, function(){
			
				var $item = $(this);
					$filter = $item.closest(".YS__filter"),
					$filter_value = $filter.find(".YS__filter__value")[0],
					$select = $filter.find("select"),
					name = $item.text(),
					title = $filter.data("title"),
					value = $item.data("value"),
					mode = $filter.data("mode");
					
				if (!YS.device.isMobile){
					$filter_value.style.width = $filter_value.firstElementChild.offsetWidth + "px";
				}
					
				if (mode == "multi"){
					if ($item[0].className.match(/checked/)){
						$item.removeClass("YS__filter__select__item--checked");
						$select.find("option[value="+value+"]")[0].selected = false;
					}
					else {
						$item.addClass("YS__filter__select__item--checked");
						$select.find("option[value="+value+"]")[0].selected = true;
					}
					
					var counts = $filter.find(".YS__filter__select__item--checked").length;
					
					if (counts > 1){
						$filter.find(".YS__filter__value__string")[0].innerHTML = counts + ' x ' + title;
					}
					else if (counts) {
						var name = $filter.find(".YS__filter__select__item--checked").text();
						$filter.find(".YS__filter__value__string")[0].innerHTML = name;
					}
					if (!counts){
						$filter.removeClass("YS__filter--selected");
						$filter.find(".YS__filter__value__string")[0].innerHTML = title;
						$filter_value.style.width = "auto";
					}
					else {
						$filter.addClass("YS__filter--selected");
						if (!YS.device.isMobile){
							setTimeout(function(){
								$filter_value.style.width = $filter_value.firstElementChild.offsetWidth + "px";
							}, 5);
						}
					}
				}
				else {
					$filter.addClass("YS__filter--selected").removeClass("YS__filter--active");	
					$filter.find(".YS__filter__value__string")[0].innerHTML = name;
					$select.val(value);
					if (!YS.device.isMobile){
						setTimeout(function(){
							$filter_value.style.width = $filter_value.firstElementChild.offsetWidth + "px";
						}, 5);
					}
				}
				
				YS.ui.panel.filter_apply.addClass("YS__filter__apply--active");
				
				_this.resize();
			});			
			
			// Delete selected
			YS.ui.panel.filter.find(".YS__filter__delete").on(clickEvent, function(){
			
				var $filter = $(this).parent(),
					$select = $filter.find("select"),
					title = $filter.data("title"),
					mode = $filter.data("mode");
					
				$filter.removeClass("YS__filter--selected");
				$filter.find(".YS__filter__value__string")[0].innerHTML = title;
				
				if (mode == "multi"){
					$filter.find(".YS__filter__select__item--checked").removeClass("YS__filter__select__item--checked");
					$select.find("option").each(function(){
						this.selected = false;
					});
				}
				else if (mode == "select"){
					$select.val("");
				}
				else if (mode == "range"){
					$filter.find("input").val("");
				}
				
				$filter.find(".YS__filter__value")[0].style.width = "auto";
				
				YS.ui.panel.filter_apply.addClass("YS__filter__apply--active");
			
				if (!$body[0].className.match(/openFilter/)){
					_this.open();
				}
				if (!YS.ui.panel.self[0].className.match(/active/)){
					YS.ui.panel.filter.addClass("YS__panel__filter--active");
					YS.ui.panel.self.addClass("YS__panel--active");	
				}
				
				_this.resize();
			});			
			
			// Add button filter
			YS.ui.panel.filter_apply = $('<div class="YS__filter__apply">Применить фильтр</div>');
			
			$root.append(YS.ui.panel.filter_apply);			
			
			// Apply filter settings
			YS.ui.panel.filter_apply.on(clickEvent, function(){
			
				$(this).velocity({
					opacity: 0
				}, 'ease', 100, function(){
					$(this).removeClass("YS__filter__apply--active").attr("style", "");
				});
				
				var data = JSON.stringify(form2js(YS.ui.panel.filter_container[0]));
				
				YS.ui.panel.filter.find(".YS__filter--active").removeClass("YS__filter--active");
				YS.ui.panel.filter.removeClass("YS__panel__filter--active");
				YS.settings.filter.callback(data, function(){
					_this.exit();
				});
			});
			
			// Loading Filter out memory
			if (YS.settings.filter.memory) _this.data();
			
			setTimeout(function(){
				_this.resize();
			}, 100);
		},
		data: function(){
			var _this = this;
			
			var json = $.cookie('YS__filter');
			
			if (typeof json === "string"){
			
				js2form(YS.ui.panel.filter_container[0], JSON.parse(json));
				
				YS.ui.panel.filter_container.find(".YS__filter").each(function(){
					
					var $filter = $(this),
						$item = $filter.find("YS__filter__select__container"),
						mode = $filter.data("mode"),
						name = $filter.data("name"),
						title = $filter.data("title");
					
					if (mode == "range"){
					
						var from = $filter.find("."+ name +"_from").val(),
							to = $filter.find("."+ name +"_to").val();
					
						if (from > 0 && to > 0){
						
							var $slider = $filter.find(".YS__filter__range__slider");
								
							$slider[0].noUiSlider.set([from, to]);
							
							$filter.find(".noUi-handle-lower")[0].innerHTML = YS.plugins.convertPrice(from);
							$filter.find(".noUi-handle-upper")[0].innerHTML = YS.plugins.convertPrice(to);
							$filter.find(".YS__filter__value__string")[0].innerHTML = YS.plugins.convertPrice(from) + " — " + YS.plugins.convertPrice(to);
							$filter.addClass("YS__filter--selected");
						}
					}
					else {
					
						if (mode == "multi"){
						
							var counts = 0;
							for (var options = $filter.find("select")[0].getElementsByTagName("option"), i = 0, l = options.length; i < l; i++){
								if (options[i].selected){
									counts++;
									$filter.find(".YS__filter__select__item[data-value="+ options[i].value +"]").addClass("YS__filter__select__item--checked");
								}
							}
							if (counts > 1){
								$filter.find(".YS__filter__value__string")[0].innerHTML = counts + ' x ' + title;
							}
							else if (counts) {
								var name = $filter.find(".YS__filter__select__item--checked").text();
								$filter.find(".YS__filter__value__string")[0].innerHTML = name;
							}
							if (counts > 0){
								$filter.addClass("YS__filter--selected");
							}
						}
						else if (mode == "select"){
							
							var	$select = $filter.find("select"),
								value = $select.val(),
								item = $select.find("option[value="+ value +"]").text();
							
							if (value){
								$filter.find(".YS__filter__value__string").text(item);
								$filter.addClass("YS__filter--selected");
							}
						}
					}
				});
			}
		},
		open: function(filter){
			var _this = this;
			
			if (_this.filter !== undefined && $body[0].className.match(/openFilter/)){
				_this.filter.removeClass("YS__filter--active");
				_this.filter = $(filter);
				_this.filter.addClass("YS__filter--active");
			}
			else {
			
				$root.addClass("page_lightOverlay");
			
				if (filter){
					_this.filter = $(filter);
					_this.filter.addClass("YS__filter--active");
				}
				
				YS.status("openFilter", true);
				
				$root.on(clickEvent, function(e){
					var id = e.target.id;
					if (id && id == "root"){
						_this.close();
					}
				});
				
				YS.plugins.frozeScroll();
			}
		},
		resize: function(){
			var _this = this;
			
			if (YS.device.isMobile) {
				if (!_this.resizeMobile) {
				
					_this.resizeMobile = true;
					YS.ui.panel.self[0].className = "YS__panel YS__panel__menu--compact YS__panel__menu--compact-md";
				}
			}
			else {
			
				var selected = YS.ui.panel.filter.find(".YS__filter--active.YS__filter--selected").find(".YS__filter__value")[0],
					selectedWidth = 0;
					
				if (selected) selectedWidth = selected.offsetWidth;
				
				setTimeout(function(){
				
					var width_filter = YS.ui.panel.filter[0].offsetWidth,
						width_container = YS.ui.panel.filter_container[0].offsetWidth,
						class_self = YS.ui.panel.self[0].className;
						
					if (selected){
						width_container = width_container - selectedWidth + parseInt(selected.firstElementChild.offsetWidth + 41);
						width_container += 55;
					}		
					else {
						width_container += 29;
					}

					var delta = width_filter - width_container;
						
					if (delta < 20){
						if (!class_self.match(/compact/)){
							YS.ui.panel.self.addClass("YS__panel__menu--compact");
						}
						else if (class_self.match(/compact/) && !class_self.match(/compact-md/)){
							YS.ui.panel.self.addClass("YS__panel__menu--compact-md");
						}
					}
					else if (class_self.match(/compact/) && delta > 230){
						if (class_self.match(/compact-md/)){
							YS.ui.panel.self.removeClass("YS__panel__menu--compact-md");
						}
						else if (class_self.match(/compact/)){
							YS.ui.panel.self.removeClass("YS__panel__menu--compact");
						}				
					}
				}, 5);
			}
		},
		exit: function(){
			var _this = this;
		
			$root.removeClass("page_lightOverlay");
			
			YS.ui.panel.self.removeClass("YS__panel--active");
			
			YS.ui.panel.self.on(prefixed.transition + "end", function(){
				YS.ui.panel.self.off(prefixed.transition + "end");
				YS.ui.panel.filter.removeClass("YS__panel__filter--active");
			});
			
			$root.off(clickEvent);
			
			YS.plugins.unFrozeScroll();
			
			YS.status("openFilter", false);		
		},
		close: function(){
			var _this = this;
			
			if (_this.filter){
				_this.filter.removeClass("YS__filter--active");
			}
			else {
				YS.ui.panel.filter.find(".YS__filter--active").removeClass("YS__filter--active");
			}
			_this.exit();
		}
	};
	
})(site);
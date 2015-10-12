site.views.filterBox = (function(YS){

    return {
	
		init: function(){
			var _this = this;
		
			YS.ui.filterBox = $('<div class="YS__filterBox"></div>'),
			YS.ui.filterBox.button = YS.ui.categoryPanel.find(".YS__filterBox__button");
			YS.ui.filterBox.form = $('<form></form>')[0];
			YS.ui.filterBox.append(YS.ui.filterBox.form);
			
			// Open FilterBox
			YS.ui.filterBox.button.on(clickEvent, function(){
				if (this.className.match(/active/)){
					_this.close();
				}
				else {
					_this.open();
					
					$root.on(clickEvent, function(e){
						var id = e.target.id;
						if (id && id == "root"){
							_this.close();
						}
					});
				}
			});	
			
			// FilterBox create
			$root.append(YS.ui.filterBox);
			
			YS.ui.filterBox.css({
				"position": "absolute",
				"top": (YS.ui.filterBox.button.offset().top + 42) + "px",
				"left": YS.ui.filterBox.button.offset().left + "px"
			});
			
			YS.ui.filterBox.form.innerHTML = document.getElementById("filter-params").innerHTML;
			
			// Add button filter
			YS.ui.filterBox.apply = $('<div class="YS__filter__apply YS__filter__apply--white">Применить фильтр</div>');
			$root.append(YS.ui.filterBox.apply);			

			this.build(YS.ui.filterBox, YS.ui.filterBox.apply, function(){
				
				// Apply filter settings
				YS.ui.filterBox.apply.on(clickEvent, function(){
				
					$(this).velocity({
						opacity: 0
					}, 'ease', 100, function(){
						$(this).removeClass("YS__filter__apply--active").attr("style", "");
					});
					
					var data = JSON.stringify(form2js(YS.ui.filterBox.form));
					
					YS.ui.filterBox.removeClass("YS__filterBox--active");
					YS.ui.filterBox.button.removeClass("YS__filterBox__button--active");
					YS.settings.filter.callback(data, function(){
						YS.views.filterBox.close();
					});
				});			
			
			});
			
		},
		build: function(filterBox, buttonApply, apply){
		
			// Building
			filterBox.find(".YS__filter").each(function(){

				var $filter = $(this),
					$item = $filter.children(),
					mode = $item.data("mode"),
					title = $item.data("title");
					
				$filter.removeClass("YS__filter").addClass("YS__filterBox__filter");
					
				if ($item[0].nodeName.toLowerCase() == "select"){
				
					if (mode == "multi" || mode == "size") {
						$filter.attr("data-mode", "multi");
						$item.attr("multiple", "multiple");
					}
					
					$item.val("");
					
					var	select = "",
						_select = "",
						param = "select",
						name = $item.attr("name");
					
					$item.find("option").each(function(){
						if (mode == "multi"){
							param = "checkbox";
						}
						if (this.getAttribute("data-color")){
							param = "color";
						}
						if (mode == "size"){
							param = "size";
						}
						_select += '<div class="YS__filterBox__item YS__filterBox__item' + (param ? '__' + param : '') + '" ' + (param == "color" ? 'style="background-color:'+ this.getAttribute("data-color") +'"' : '') + ' data-value="'+ this.getAttribute("value") +'">'+ this.innerHTML +'</div>';
					});
					
					select ='<div class="YS__filterBox__title">'+ title +'</div>';
					
					if (param == "color" || param == "size"){
						select +='<div class="YS__filterBox__container YS__filterBox__container__' + param + 's">'+
							_select +
						'</div>';						
					}
					else {
						select +='<div class="YS__filterBox__container YS__filterBox__scroller">'+
							'<div class="YS__scroller__container">'+
								_select +
							'</div>'+
						'</div>';						
					}
					
					$filter.prepend(select);
				}
				else if (mode == "range"){
				
					var name = $item.data("name"),
						min = $item.data("min"),
						max = $item.data("max"),
						step = $item.data("step");
					
					var slider = '<div class="YS__filterBox__title">' + title + '</div>'+
							'<div class="YS__filterBox__container YS__filterBox__container__slider">'+
								'<div class="YS__filterBox__slider" data-name="'+ name +'" data-min="'+ min +'" data-max="'+ max +'" data-step="'+ step +'"></div>'+
								'<div class="YS__filterBox__slider__from"></div>'+
								'<div class="YS__filterBox__slider__to"></div>'+
							'</div>'+
							'<input type="hidden" class="YS__filterBox__'+ name +'_from" name="'+ name +'[]" value="">'+
							'<input type="hidden" class="YS__filterBox__'+ name +'_to" name="'+ name +'[]" value="">';	

					$filter.data("title", title).html(slider);
				}
				
				$filter.find(".YS__filterBox__scroller").each(function(){
				
					var $elem = $(this),
						items = $elem.find(".YS__scroller__container > div").length;
					
					if (items > 5){
						YS.plugins.scrollable($elem, true);
					}
					else {
						$elem.find(".YS__scroller__container").removeClass("YS__scroller__container");
						$elem.removeClass("YS__filterBox__scroller");
					}
				});

				$filter.attr("data-title", title).attr("data-name", name).attr("data-mode", mode);
			});
			
			// Change select item
			filterBox.find(".YS__filterBox__item").on(clickEvent, function(){
				var $item = $(this);
					$filter = $item.closest(".YS__filterBox__filter"),
					$select = $filter.find("select"),
					value = $item.data("value"),
					type = this.className.match(/item__(\w+)/)[1];
					
				if (this.className.match(/active/)){
					$item.removeClass("YS__filterBox__item" + (type ? "__" + type : "") + "--active");
					$select.find("option[value="+value+"]")[0].selected = false;
				}
				else {
					$item.addClass("YS__filterBox__item" + (type ? "__" + type : "") + "--active");
					$select.find("option[value="+value+"]")[0].selected = true;
				}
				if (type == "select"){
					$item.siblings().removeClass("YS__filterBox__item" + (type ? "__" + type : "") + "--active");
				}
				
				if (buttonApply) buttonApply.addClass("YS__filter__apply--active");
			});
			
			// Create Range Slider
			filterBox.find(".YS__filterBox__slider").each(function(){
				
				var $slider = $(this),
					$filter = $slider.closest(".YS__filterBox__filter"),
					name = $slider.data("name"),
					min = $slider.data("min"),
					max = $slider.data("max"),
					step = $slider.data("step"),
					from = $slider.parent().find(".YS__filterBox__slider__from"),
					to = $slider.parent().find(".YS__filterBox__slider__to");
			
				$slider.slider({
					range: true,
					step: step,
					min: min,
					max: max,
					values: [min, max],
					slide: function(event, ui) {
						from[0].innerHTML = YS.plugins.convertPrice(ui.values[0]);
						to[0].innerHTML = YS.plugins.convertPrice(ui.values[1]);
						$filter.find(".YS__filterBox__"+ name +"_from").val(ui.values[0]);
						$filter.find(".YS__filterBox__"+ name +"_to").val(ui.values[1]);	
						if (buttonApply) buttonApply.addClass("YS__filter__apply--active");
					}
				});
				
				$slider.find(".ui-slider-range").addClass("YS__filterBox__slider__range");
				$slider.find(".ui-slider-handle:first").addClass("YS__filterBox__slider__handle YS__filterBox__slider__handle__from");
				$slider.find(".ui-slider-handle:last").addClass("YS__filterBox__slider__handle YS__filterBox__slider__handle__to");
				
				from[0].innerHTML = YS.plugins.convertPrice($slider.slider("values", 0));
				to[0].innerHTML = YS.plugins.convertPrice($slider.slider("values", 1));
			});
			
			if (apply && typeof apply == "function") apply();
		},
		open: function(){
		
			YS.status("openFilter", true);
		
			YS.ui.filterBox.addClass("YS__filterBox--active");
			YS.ui.filterBox.button.addClass("YS__element__select--active");
			$root.addClass("page_lightOverlay_4");
			
			YS.ui.filterBox.css({
				"top": (YS.ui.filterBox.button.offset().top + 42) + "px",
				"left": YS.ui.filterBox.button.offset().left + "px"
			});			
			
		},
		close: function(){
		
			YS.status("openFilter", false);
		
			$root.removeClass("page_lightOverlay_4");
			YS.ui.filterBox.removeClass("YS__filterBox--active");
			YS.ui.filterBox.button.removeClass("YS__element__select--active");
			
			$root.off(clickEvent);
		}
	};
	
}(site));
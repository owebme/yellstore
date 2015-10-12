site.views.productsGalleryTwirl = (function(YS){

    return {

		init: function(items, buttons){
			var _this = this;
			
			if (!items) return false;

			$(items).each(function(){
				var $item = $(this),
					$front = $item.find('.productt__item__front'),
					$front_shadow = $front.find('.productt__item__shadow'),
					$back = $item.find('.productt__item__back'),
					$back_shadow = $back.find('.productt__item__shadow'),
					$close = $back.find('.productt__item__back--close'),
					height = $item.height();
					
				if (height > 0) $item.css("height", height + "px");
					
				$item.find("." + buttons).on("click", function(e){
					e.preventDefault();
					
					$item.addClass('flip-10');			
					setTimeout(function(){					
						$item.removeClass('flip-10').addClass('flip90');
						$front_shadow.show().fadeTo(80, 1, function(){
							$front.hide();
							$front_shadow.hide();
						});
					}, 50);
					
					setTimeout(function(){
						$item.removeClass('flip90').addClass('flip190');
						$back.addClass("productt__item__back--active");
						$back.show();
						$back_shadow.show().fadeTo(90, 0);
						setTimeout(function(){
							$item.removeClass('flip190').addClass('flip180');
							$back_shadow.hide();						
							setTimeout(function(){
								$item.css('transition', '100ms ease-out');
								$close.find('.cx, .cy').addClass('s1');
								setTimeout(function(){$close.find('.cx, .cy').addClass('s2');}, 100);
								setTimeout(function(){$close.find('.cx, .cy').addClass('s3');}, 200);				
							}, 20);
						}, 100);
					}, 150);
					
				});
				
				$close.on("click", function(){
					$item.removeClass('flip180').addClass('flip190');
					setTimeout(function(){
						$item.removeClass('flip190').addClass('flip90');
						$back_shadow.css('opacity', '0').fadeTo(100, 1, function(){
							$back.hide();
							$back_shadow.hide();
							$front.show();
							$front_shadow.show();
						});
					}, 50);
					
					setTimeout(function(){
						$item.removeClass('flip90').addClass('flip-10');
						$front_shadow.show().fadeTo(100, 0);
						setTimeout(function(){
							$front_shadow.hide();
							$item.removeClass('flip-10').css('transition', '100ms ease-out');		
							$close.find('.cx, .cy').removeClass('s1 s2 s3');			
						}, 100);			
					}, 150);
				});
			});
		}
	}

})(site);
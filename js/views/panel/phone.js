site.views.phone = (function(YS){

    return {
	
		init: function(){
			var _this = this;
		
			if (!YS.ui.popupPhone){
		
				YS.ui.popupPhone = '<div class="YS__popup__phone__title">'+
					'<div class="YS__popup__phone__title_top">'+
						'<span class="YS__popup__phone__title_gray">Наш номер:</span> <span class="YS__popup__phone__title_green">8 800 755-55-55</span>'+
					'</div>'+
					'Бесплатный звонок по России<br> с любых телефонов'+
				'</div>'+
				'<form class="YS__popup__phone__form">'+
					'<input type="text" class="YS__popup__phone__value" placeholder="+7">'+
					'<div class="YS__popup__phone__button">Жду звонка</div>'+
				'</form>'+
				'<div class="YS__popup__phone__text">'+
					'Для нас очень важен комфорт покупателей, мы стараемся максимально быстро реагировать на все запросы и пожелания, если вам удобно, мы можем обсудить все вопросы по телефону.'+
				'</div>';
				
				if (YS.ui.panel && YS.ui.panel.phone){
					YS.ui.panel.phone.on(clickEvent, function(){
						if (!this.className.match(/active/)){
							_this.open();
						}
						else {
							_this.close();
						}
					});
				}
			}
		},
		open: function(data){
			YS.views.popup.open({
				popup: "phone",
				html: YS.ui.popupPhone
			});				
		},
		close: function(){
			YS.views.popup.close();
		}
	};
	
})(site);
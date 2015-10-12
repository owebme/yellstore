site.views.productSocial = (function(YS){

    return {

		init: function(container){
			var _this = this;
			
			container.find(".product__preview__desc__social__item").on(clickEvent, function(){
				_this.shared(this.getAttribute("data-social"));
			});
		},
		shared: function(data){
			var link="",
			text = document.title,
			address = window.location.href;
			if (data == "fb"){link = 'https://www.facebook.com/sharer/sharer.php?u='+address+'?utm_source=social_fb';}
			else if (data == "vk"){link = 'http://vk.com/share.php?url='+address+'?utm_source=social_vk';}
			else if (data == "dk"){link = 'http://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl='+address+'?utm_source=social_dk&st.comments='+encodeURIComponent(text);}
			else if (data == "tw"){link = 'https://twitter.com/intent/tweet?original_referer='+address+'&text='+encodeURIComponent(text)+'&url='+address+'?utm_source=social_tw';}
			window.open(link,"displayWindow","width=520,height=300,left=350,top=170,status=no,toolbar=no,menubar=no");	
		}		
	}

})(site);
site.views.links = (function(YS){

    return {
	
		init: function(){
			var _this = this;
			
			if (!YS.template.cloudLinks) YS.template.cloudLinks = $(document.getElementById("cloud-links").innerHTML);
			
			$root.append(YS.template.cloudLinks);
			
			this.links = YS.template.cloudLinks[0];
			
			if (!this.links) return false
			
			_this.build();
			
		},
		build: function(){
			var _this = this;
			
			var html = document.createElement("div"),
				items = _this.links.getElementsByTagName("a");
				
			for (var i = 0, item; item = items[i++];) {
			
				var length = item.innerHTML.length, size;
			
				if (length > 10){size = 1;}
				else if (length > 6 && length < 11){size = 2;}
				else {size = 3;}
			
				html.innerHTML += '<div class="YS__cloud__links__tag YS__cloud__links__tag_'+ i +'"><a href="'+ item.getAttribute("href") +'" class="YS__cloud__links__tag__size'+ size +'">'+ item.innerHTML +'</a></div>';
			}
			
			html.innerHTML = '<div class="YS__cloud__links__title">Недавно просмотренные категории</div>'+
					'<div class="YS__cloud__links__tags">'+
						html.innerHTML +
					'</div>';
				
			html.className = 'YS__cloud__links';	
				
			_this.links.parentNode.removeChild(_this.links);
			
			YS.ui.cloud_links = $(html);
			
			$root.append(YS.ui.cloud_links);
			
			if (YS.settings.cloudLinks.ajax){
				YS.ui.cloud_links.find("a").on("click", function(e){
					e.preventDefault();
					YS.settings.cloudLinks.callback(this);
				});
			}
		}
	};
	
})(site);
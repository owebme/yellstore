site.views.categoryPanel = (function(YS){

    return {
	
		init: function(){
		
			if (!YS.ui.categoryPanel){
		
				YS.template.init((filterBox ? "categoryPanelFilterBox" : "categoryPanel"), function(){

					YS.ui.categoryPanel = $((filterBox ? YS.template.categoryPanelFilterBox : YS.template.categoryPanel));
					$page_content.before(YS.ui.categoryPanel);
					
					YS.views.sorting.init();
					YS.views.viewing.init((filterBox ? "view2" : "view1"));
					YS.views.breadcrumbs.init();
				});
			}
		}
	};
	
})(site);
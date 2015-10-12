site.views.productNavigation = (function(YS){

    return {

		init: function(){
			var startPress = true;

			if (!YS.device.isMobile){
				$body.on("keyup.productQuick", function(e){
					if (!YS.ui.containerProduct[0].className.match(/blur/)){

						// Next product
						if (e.which == "39"){
							if (startPress){
								startPress = false;
								YS.app.productPage({id: "random", action: "reload", direction: "left"});
								setTimeout(function(){
									startPress = true;
								}, (YS.device.isFirefox ? 2000 : 1000));
							}
						}
						// Prev product
						if (e.which == "37"){
							if (startPress){
								startPress = false;
								YS.app.productPage({id: "random", action: "reload", direction: "right"});
								setTimeout(function(){
									startPress = true;
								}, (YS.device.isFirefox ? 2000 : 1000));
							}
						}
						// Close (key esc)
						if (e.which == "27"){
							YS.views.productQuick.close();
						}
					}
				});
			}
		}
	};

})(site);
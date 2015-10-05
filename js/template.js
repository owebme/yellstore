site.template = (function(YS){

    return {

		init: function(module, callback){
		
			if (!YS.template[module]){

				if (YS.device.isLocalStorage
				
				&& (!localStorage["template_" + module]
					
				|| this[module + "Update"] != localStorage["template_" + module + "Update"])){
				
					localStorage["template_" + module] = this.load(YS.settings.template[module]);
					localStorage["template_" + module + "Update"] = this[module + "Update"];
					this.save(localStorage["template_" + module], module);
					console.log("template_load__" + module);
				}
				else if (YS.device.isLocalStorage && localStorage["template_" + module]){
					this.save(localStorage["template_" + module], module);
					console.log("template_loadedStorage__" + module);
				}
				else {
					this.save(this.load(YS.settings.template[module]), module);
					console.log("template_loaded__" + module);
				}
			}
			
			if (callback) callback();
		},
		save: function(data, module){
		
			if (data.match(/\{\{/)){
				this[module] = Handlebars.compile(data);
			}
			else {
				this[module] = data;
			}
		},
		load: function(data){
			return document.getElementById(data).innerHTML
		}
	};

})(site);
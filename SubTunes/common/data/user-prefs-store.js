/*global Persist: false, window: false, soundManager: false, alert: false, unescape: false, toString: false, escape: false */
(function($){
	Persist.Store.prototype.getWithDefault = function(name, defaultValue) {
        var val = null;
        this.get(name, function(k,v) {
            if (k) {
                val = v;
            }
        });
        if (val) {
            return this.decodeValue(val);
        }
        return defaultValue;
    };
	
	Persist.Store.prototype.initSoundManager = function(){
		soundManager.useHTML5Audio = (window.subtunes.mode === 'touch'? true : this.getWithDefault('use-html5-audio', false));
		soundManager.debugMode = false;
		soundManager.consoleOnly = true;
		var forceUseHtml5ForMp3 = (window.subtunes.mode === 'touch' ? true : this.getWithDefault('force-use-html5-for-mp3', false));
		soundManager.html5Test = (forceUseHtml5ForMp3? /(probably|maybe)/i : /(probably)/i);
		soundManager.useFlashBlock = (window.subtunes.mode !== 'touch');
		soundManager.onready(function() {
			if (!soundManager.supported()) {
				alert('Something went wrong whilst setting up sound. Do you have flashblock enabled?');
			}
		});
	};
	
	Persist.Store.prototype.initExt = function(){
		Ext.ux.mattgoldspink.subsonic.apiUrl = this.getWithDefault('subsonic-api-url', undefined);
	};
	
	Persist.Store.prototype.setApiUrl = function(newUrl){
		var old = this.set('subsonic-api-url', this.encodeValue(newUrl));
		Ext.ux.mattgoldspink.subsonic.apiUrl = newUrl;
		if (old !== undefined) {
			alert('You will need to reload the page for this setting to take effect');
		}
	};
	
	Persist.Store.prototype.decodeValue = function(cookie){
        var re = /^(a|n|d|b|s|o)\:(.*)$/, all, i, l, arr;
        var matches = re.exec(unescape(cookie));
        if(!matches || !matches[1]) {
			return; 
		}
        var type = matches[1];
        var v = matches[2];
        switch(type){
            case "n":
                return parseFloat(v);
            case "d":
                return new Date(Date.parse(v));
            case "b":
                return (v == "1");
            case "a":
                all = [];
                if(v !== ''){
					arr = v.split('^');
					for (i = 0, l = arr.length; i < l; i++) {
                        all.push(this.decodeValue(arr[i]));
                    }
                }
                return all;
           case "o":
                all = {};
                if(v !== ''){
					arr = v.split('^');
					for (i = 0, l = arr.length; i < l; i++) {
                        var kv = arr[i].split('=');
                        all[kv[0]] = this.decodeValue(kv[1]);
                    }
                }
                return all;
           default:
                return v;
        }
    };
    
    Persist.Store.prototype.encodeValue = function(v){
        var enc, flat;
        if(typeof v == "number"){
            enc = "n:" + v;
        }else if(typeof v == "boolean"){
            enc = "b:" + (v ? "1" : "0");
        }else if(toString.apply(v) === '[object Date]'){
            enc = "d:" + v.toGMTString();
        }else if(toString.apply(v) === '[object Array]'){
            flat = "";
            for(var i = 0, len = v.length; i < len; i++){
                flat += this.encodeValue(v[i]);
                if(i != len-1) {
					flat += "^";
				}
            }
            enc = "a:" + flat;
        }else if(typeof v == "object"){
            flat = "";
            for(var key in v){
                if(typeof v[key] != "function" && v[key] !== undefined){
                    flat += key + "=" + this.encodeValue(v[key]) + "^";
                }
            }
            enc = "o:" + flat.substring(0, flat.length-1);
        }else{
            enc = "s:" + v;
        }
        return escape(enc);
    };
	
	$.subtunes.userPrefsStore = new Persist.Store('subtunes-user-preferences');
})(window);
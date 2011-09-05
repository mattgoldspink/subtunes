Ext.require([
	'Ext.container.Viewport', 
	'Ext.window.MessageBox',
	'SubTunesDesktop.view.SubsonicViewport',
	'SubTunesDesktop.view.TrackGrid'
]);
var renderTime = function(time){
	return Ext.util.Format.number((time / 60), '0') + ':' + Ext.util.Format.number((time % 60)/100, '.00').substring(2);
};

Ext.application({
    name: 'SubTunesDesktop',
    appFolder: 'SubTunesDesktop',
    statics: {
		loginDetails: {
			c: 'subtunes',
			v: '1.4.0',
			f: 'json'
    	},
		version: new Ext.Version('1.0.0'),
		hexEncode: function (data){
			var b16_digits = '0123456789abcdef', 
				b16_map = [], 
				i, 
				result = [];
			for (i = 0; i < 256; i++) {
				b16_map[i] = b16_digits.charAt(i >> 4) + b16_digits.charAt(i & 15);
			}
		
			for (i = 0; i < data.length; i++) {
				result[i] = b16_map[data.charCodeAt(i)];
			}
		
			return result.join('');
		},
		getUrlPrefix: function() {
			var loc = window.location;
			return loc.protocol + '//' + loc.host;
		},
		urls: ['', '/subsonic', '/music']
    },
    views: ['SubsonicViewport', 'TrackGrid'],
    controllers: [
    	'Login',
    	'UserController',
    	'LibraryController',
		'SubsonicRestApiController'
    ],
    currentUrlIndex: -1,
    launch: function() {
    	this.viewport = Ext.createWidget('subsonicviewport'); 
		this.detectBaseUrl();
    },
	handlePromptResponse: function(btn, text){
		var self = this.statics,
			urlPrefix = self.getUrlPrefix();
		if (btn == 'ok'){
			if (text.substr(-1) === '/') {
				text = text.substr(0, text.length - 1);
			}
			if (text.indexOf(urlPrefix) != -1) {
				text = text.substr(urlPrefix.length);
			}
			self.urls.push(text);
			this.detectBaseUrl();
		}
	},
	detectBaseUrl: function() {
		var self = this.statics,
			mb = Ext.Msg,
			i = ++this.currentUrlIndex,
			urls, urlPrefix;
		urls = self.urls;
		urlPrefix = self.getUrlPrefix();
		if ((i > urls.length && urls.length !== 0) || urls.length === 0) {
			mb.hide();
			mb.prompt(
				'Subsonic path', 
				'Enter the path to subsonic (It must be on the same webserver' + 
				', eg. ' + urlPrefix + '/subsonic ):', 
				this.handlePromptResponse, 
				this, false, 
				urlPrefix
			);
		} else {
			mb.show({
				msg: 'Attempting to auto discover subsonic api url...<br>Testing: ' + urlPrefix + urls[i],
				progressText: 'Checking',
				width:300,
				wait:true,
				waitConfig: {interval:200}
			});
			Ext.Ajax.request({
				url: urls[i] + '/rest/ping.view',
				params: self.loginDetails,
				callback: this.handlePingResponse,
				scope: this
			});
		}
	},
	handlePingResponse: function(options, success, response) {
		var self = this.statics,
			mb = Ext.Msg,
			i = this.currentUrlIndex,
			urls, urlPrefix, dead;
		urls = self.urls;
		urlPrefix = self.getUrlPrefix();
		if (response.status !== 404) {
			try {
				// see if the resonse is JSON and can pull out subsonic-response
				dead = Ext.decode(response.responseText)['subsonic-response'];
				mb.hide();
				//w.subtunes.userPrefsStore.setApiUrl(urls[i]);
				//Ext.ux.mattgoldspink.subsonic.notYetLoggedIn = true;
				//w.subtunes.overrideDefaultExtHandlersOnConnection();
			} catch (e) {
				this.detectBaseUrl();
			}
			this.getController('UserController').setBaseApiUrl(urls[i]);
			this.getController('Login').doLoginIfNeeded(dead.status);
		} else {
			if ((i > urls.length && urls.length !== 0) || urls.length === 0) {
				mb.alert('Subsonic not found!', 
					'No subsonic instance was found at ' + urlPrefix + urls[i] + '. Please try again...', 
					this.handleNotFound,
					this);
			} else {
				this.detectBaseUrl();
			}
		}
	},
	handleNotFound: function(){
		Ext.Msg.hide();
		this.detectBaseUrl();
	}
});
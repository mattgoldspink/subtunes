Ext.define('SubTunesDesktop.controller.UserController', {
    extend: 'Ext.app.Controller',
	requires: [
		'SubTunesDesktop.state.PersistJSStateProvider'
	],
	mgr: Ext.state.Manager,
	init: function(application) {
		var me = this;
		me.mgr.setProvider(
			new SubTunesDesktop.state.PersistJSStateProvider({
				name: 'subtunes-settings'
			})
		);
		me.loginDetails = application.statics.loginDetails;
		this.getUsername();
		this.getPassword();
	},
	getBaseApiUrl: function(){
		if (!this.apiUrl) {
			this.apiUrl = this.mgr.get('subtunes.base.api.url');
		}
		return this.apiUrl;
	},
	getPassword: function() {
		if (!this.loginDetails.p) {
			this.loginDetails.p = this.mgr.get('subtunes.password');
		}
		return this.loginDetails.p;
	},
	getUsername: function() {
		if (!this.loginDetails.u) {
			this.loginDetails.u = this.mgr.get('subtunes.username');
		}
		return this.loginDetails.u;
	},
	getLastModified: function() {
		return this.mgr.get('subtunes.lastmodified');
	},
	setBaseApiUrl: function(url) {
		this.apiUrl = url;
		this.mgr.set('subtunes.base.api.url', url);
		// once we have base url we need to set our custom parser
		Ext.Ajax.on('requestcomplete', this.parseResponse);
	},
	setPassword: function(password) {
		this.password = password;
		this.loginDetails.p = password;
		this.mgr.set('subtunes.password', password);
	},
	setUsername: function(username) {
		this.loginDetails.u = username;
		this.mgr.set('subtunes.username', username);
	},
	setLastModified: function(timestamp) {
		this.mgr.set('subtunes.lastmodified', timestamp);
	},
	parseResponse: function(conn, response, options) {
		var responseData = Ext.decode(response.responseText)['subsonic-response'],
			errorCode, errorMessage, mb = Ext.Msg;
		response.responseData = responseData;
		if (responseData.status === 'failed') {
			errorCode = responseData.error.code;
			errorMessage = responseData.error.message;
			mb.alert('Request Failed - ' + errorCode, errorMessage);
			return false;
		}
	},
});
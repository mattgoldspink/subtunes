Ext.define('SubTunesDesktop.controller.SubsonicRestApiController', {
    extend: 'Ext.app.Controller',
    
    init: function(application) {
    	this.l = application.statics.loginDetails;
    	this.a = Ext.Ajax;
    	this.userController = this.getController('UserController');
    },
	
	/** private **/
    getBaseApiUrl: function() {
    	return this.userController.getBaseApiUrl();
    },
	
	ping: function (config) {
		var me = this,
			params = Ext.applyIf(config.params?config.params: {}, me.l),
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/ping.view',
				method: 'GET',
				params: params
			}, config);
		me.a.request(conf);
	},
	
	getLicense: function(config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getLicense.view',
				method: 'GET',
				params: me.l
			}, config);
		me.a.request(conf);
	},
	
	getMusicFolders: function(config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getMusicFolders.view',
				method: 'GET',
				params: me.l
			}, config);
		me.a.request(conf);
	},
	
	
	getIndexes: function(musicFolderId, ifModifiedSince, config) {
		var me = this,
			params = Ext.apply({}, me.l), conf;
		if (ifModifiedSince) {
			params.ifModifiedSince = ifModifiedSince;
		}
		if (musicFolderId) {
			params.musicFolderId = musicFolderId;
		}
		conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getIndexes.view',
				method: 'GET',
				params: params				
			}, config);
		me.a.request(conf);
	},
	
	getMusicDirectory: function(id, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getMusicDirectory.view',
				method: 'GET',
				params: Ext.apply({
					id: id
				}, me.l)
			}, config);
		me.a.request(conf);
	},
		
	search2: function(query, queryConfig, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/search2.view',
				params: Ext.apply({
					query: query
				}, queryConfig, me.l)
			}, config);
		me.a.request(conf);
	},
	
	getPlaylists: function(config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getPlaylists.view',
				params: me.l
			}, config);
		me.a.request(conf);
	},
	
	getPlaylist: function(id, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getPlaylist.view',
				params: Ext.apply({
					query: query
				}, me.l)
			}, config);
		me.a.request(conf);
	},
	
	createPlaylist: function(name, songId, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/createPlaylist.view',
				params: Ext.apply({
					name: name,
					songId: songId
				}, me.l)
			}, config);
		me.a.request(conf);
	},
	
	addTrackToPlaylist: function(playlistId, songId, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/createPlaylist.view',
				params: Ext.apply({
					playlistId: playlistId,
					songId: songId
				}, me.l)
			}, config);
		me.a.request(conf);
	},
		
	deletePlaylist: function(id, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/deletePlaylist.view',
				params: Ext.apply({
					id: id
				}, me.l)
			}, config);
		me.a.request(conf);
	},
		
	scrobble: function(id, submission, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/scrobble.view',
				params: Ext.apply({
					id: id,
					submission: submission
				}, me.l)
			}, config);
		me.a.request(conf);
	},
	
	getUser: function(username, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getUser.view',
				params: Ext.apply({
					username: username
				}, me.l)
			}, config);
		me.a.request(conf);
	},
	
	getPodcasts: function(config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getPodcasts.view',
				params: me.l
			}, config);
		me.a.request(conf);
	},
	
	setRating: function(id, rating, config) {
		var me = this,
			conf = Ext.apply({
				url: me.getBaseApiUrl() + '/rest/getPodcasts.view',
				params: Ext.apply({
					id: id,
					rating: rating
				}, me.l)
			}, config);
		me.a.request(conf);
	}
});
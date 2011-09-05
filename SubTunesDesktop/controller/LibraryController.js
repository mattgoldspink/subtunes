Ext.define('SubTunesDesktop.controller.LibraryController', {
    extend: 'Ext.app.Controller',
    stores: ['Library'],
    models: ['Record'],
    asyncMode: false,
    init: function(application) {
    	this.loginDetails = application.statics.loginDetails;
		this.getRecordModel().getProxy();

    	/*if (!!window.Worker) {
    		Ext.Loader.require('SubTunesDesktop.controller.WebWorkerLoader', this.postLoaderImpl, this);
    	} else {*/
    		this.restApi = this.getController('SubsonicRestApiController');
    	/*}*/
    },
    
    postLoaderImpl: function(){
    	this.asyncMode = true;
    	this.restApi = this.getController('SubTunesDesktop.controller.WebWorkerLoader');
    	this.syncDataWithServer = this.restApi.syncDataWithServer;
    	this.restApi.init(this.application);
	},
	
	getAllAlbums: function() {
	
	},
	
	getAllSongs: function() {
	
	},
	
    search: function() {
    
    },
    
    syncDataWithServer: function() {
    	this.getIndexes();
    },
    
    /** private **/    
    getFolders: function() {
    	var me = this;
    	me.restApi.getMusicFolders({
    		scope: me,
    		success: me.handleGetFoldersResponse
    	});
    },
    
    handleGetFoldersResponse: function(response, options) {
    	var root = response.responseData.musicFolders, folders;
    	if (!root.musicFolder) {
    		folders = [];
    	} else if (!Ext.isArray(root.musicFolder)) {
			folders = [root.musicFolder]	
    	} else {
    		folders = root.musicFolder;
    	}
		for (var i = 0; i < folders.length; i++) {
			this.getIndexes(folders[i].id);
		}
    },
    
    getIndexes: function(folderId) {
    	var me = this;
    	me.restApi.getIndexes(folderId, 
    		this.getController('UserController').getLastModified(), 
    		{
				scope: me,
				success: me.handleGetIndexes
			}
		);
    },
    
    handleGetIndexes: function(response, options){
    	var indexes = response.responseData.indexes, index, artists;
    	if (indexes) {
			this.getController('UserController').setLastModified(indexes.lastModified);
			for (var i = 0; i < indexes.index.length; i++) {
				index = indexes.index[i];
				for (var j = 0; j < index.artist.length; j++) {
					artists = index.artist[j];
					this.getMusicDirectory(artists.id);
				}
			}
		}
    },
    
    getMusicDirectory: function(id) {
    	new Ext.util.DelayedTask(function(){
			var me = this;
    		me.restApi.getMusicDirectory(id, {
				scope: me,
				success: me.handleGetMusicDirectory
			});
		}, this).delay(Math.floor(Math.random()*1000+200));
    },
    
    handleGetMusicDirectory: function(response, options) {
    	var dir = response.responseData.directory, child,
    		store = this.getLibraryStore();
		store.suspendEvents();
    	if (dir.child) {
			for (var i = 0; i < dir.child.length; i++) {
				child = dir.child[i];
				if (child.isDir) {
					this.getMusicDirectory(child.id);
				} else {
					this.addTrackToStore(child);
				}
			}
    	}
    	store.resumeEvents();
		store.fireEvent('datachanged', store);
    },
    
    addTrackToStore: function(track) {
		var store = this.getLibraryStore(),
		    trackRec = new SubTunesDesktop.model.Record(track);
		trackRec.save();
    	store.insert(0, trackRec);
    }
});
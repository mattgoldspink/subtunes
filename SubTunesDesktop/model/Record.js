Ext.define('SubTunesDesktop.model.Record', {
    extend: 'Ext.data.Model',
	requires: ['Ext.data.proxy.BrowserDB'],
    idProperty: 'id',
    fields: [
		{name: 'id',           type: 'string'},
		{name: 'parent',       type: 'string'},
		{name: 'title',        type: 'string'},
		{name: 'isDir',        type: 'boolean'},
		{name: 'album',        type: 'string'},
		{name: 'artist',       type: 'string'},
		{name: 'track',        type: 'int'},
		{name: 'year',         type: 'int'},
		{name: 'genre',        type: 'string'},
		{name: 'coverArt',     type: 'string'},
		{name: 'size',		   type: 'int'},
		{name: 'contentType',  type: 'string'},
		{name: 'suffix',       type: 'string'},
		{name: 'duration',     type: 'float'},
		{name: 'bitRate',      type: 'float'},
		{name: 'name',         type: 'string'},
		{name: 'playstate',    type: 'string'}
	],
	proxy: {
    	type: 'browserdb',
    	dbName: 'subtuneslibrary',
    	objectStoreName: 'subtuneslibrary',
    	dbVersion: '1.1',
    	writer: {
			type: 'json',
			writeAllFields: false
		}
    }
});
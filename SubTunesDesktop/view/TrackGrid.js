Ext.define('SubTunesDesktop.view.TrackGrid', {
    extend:   'Ext.grid.Panel',
    alias :   'widget.trackgrid',
    selModel: Ext.create('Ext.selection.CheckboxModel', {
		injectCheckbox: 1,
		checkOnly: 2
	}),
	columns: [
		{header: ' ', width: 24, sortable: false, dataIndex: 'playstate', menuDisabled: true, hideable: false, renderer: function(value) {
			if (value === 'playing') {
				return '<img src="./icons/current-track-playing-icon.png" />';
			} else if (value === 'paused') {
				return '<img src="./icons/current-track-paused-icon.png" />';
			} else {
				return '';
			}
		}}, 
		{header: 'No.', width: 28, sortable: true, dataIndex: 'track', hidden: true},
		{header: 'Name', width: 225, sortable: true, dataIndex: 'title'},
		{header: 'Time', width: 75, sortable: true, dataIndex: 'duration', renderer: renderTime},
		{header: 'Artist', width: 225, sortable: true, dataIndex: 'artist'},
		{header: 'Album', width: 225, sortable: true,  dataIndex: 'album'},
		{header: 'Genre', width: 225, sortable: true,  dataIndex: 'genre'},
		{header: 'Year', width: 85, sortable: true,  dataIndex: 'year'}
	],
	initComponent: function() {
		this.store = Ext.StoreManager.get('Library');
		this.store.on('datachanged', this.selectAll, this);
		this.callParent(arguments);
	},
	selectAll: function(store) {
		//this.getSelectionModel().selectAll();
	}
});
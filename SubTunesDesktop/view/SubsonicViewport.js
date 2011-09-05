Ext.define('SubTunesDesktop.view.SubsonicViewport', {
    extend:   'Ext.container.Viewport',
    alias :   'widget.subsonicviewport',
	layout:   'border',

    initComponent: function() {
		this.items = [
			this.buildLeftBar(),
			this.buildTopBar(),
			this.buildBottomBar(),
			this.buildCenterRegion()
		];
        this.callParent(arguments);
    },
    
    buildLeftBar: function() {
    	return {
    		xtype: 'panel',
    		title: 'Library',
    		region: 'west',
    		width: 200,
    		split: true
    	};
    },
    
    buildTopBar: function() {
    	return {
    		xtype: 'panel',
    		title: 'PlayControls',
    		region: 'north',
    		height: 70
    	};
    },    

    buildBottomBar: function() {
    	return {
    		xtype: 'panel',
    		title: 'playlist',
    		region: 'south',
    		height: 25
    	};
    },
    
    buildCenterRegion: function() {
    	return {
    		xtype: 'trackgrid',
    		region: 'center'
    	};
    },
})
Ext.require('Ext.container.Viewport');

Ext.application({
    name: 'SubTunesDesktop',
    appFolder: 'SubTunesDesktop',
    loginDetails: {
		c: 'subtunes',
        v: '1.4.0',
        f: 'json'
    },
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    title: 'Hello Ext',
                    html : 'Hello! Welcome to Ext JS.'
                }
            ]
        });
    }
});
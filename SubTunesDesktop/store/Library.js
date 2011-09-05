Ext.define('SubTunesDesktop.store.Library', {
    extend: 'Ext.data.Store',
    storeId: 'SubTunesDesktop.store.Library',
    model: 'SubTunesDesktop.model.Record',
    autoDestroy: true,
    autoSync: true,
    autoLoad: true
});
Ext.define('SubTunesDesktop.state.PersistJSStateProvider', {
    extend: 'Ext.state.Provider',

    /**
     * Creates a new PersistJSStateProvider.
     * @param {Object} config (optional) Config object.
     */
    constructor : function(config){
        var me = this;
        me.callParent(arguments);
        if (!config.name) {
        	throw 'You must set a name for the Persist.js store';
		}
        me.store = new Persist.Store(config.name);
        if (config.defaults) {
            Ext.each(config.defaults, me.initialiseDefaultValue);
            me.defaults = config.defaults;
        }
    },
    
    initialiseDefaultValue: function(key, val) {
    	var me = this;
		if (!Ext.isDefined(me.get(key))) {
			me.set(key, val.defaultValue);
		}
    },
    
    // private
    set : function(name, value){
    	var me = this;
        me.store.set(name, me.encodeValue(value));
        me.fireEvent("statechange", me, name, value);
    },

    // private
    clear : function(name){
		var me = this;
        me.store.remove(name);
		me.fireEvent("statechange", me, name, null);
    },
    
    get: function(name) {
    	var val = null,
			me = this;
        me.store.get(name, function(k,v) {
            if (k) {
                val = v;
            }
        });
        if (val) {
            return me.decodeValue(val);
        }
        return null;
    }

});
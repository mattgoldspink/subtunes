Ext.define('SubTunesDesktop.view.Login', {
    extend:   'Ext.window.Window',
    alias :   'widget.login',
    title :   'Login',
    closable: false,
	width:    370,
	plain:    true,
	layout:   'fit',
	autoShow: true,

    initComponent: function() {
		this.items = this.buildForm();
		this.buttons = this.buildButtons();
        this.callParent(arguments);
    },
    
    buildForm: function() {
    	return {
    		xtype: 'form',
    		items: this.buildFormFields()
    	};
    },
    
    buildFormFields: function() {
    	return [{
			xtype: 'textfield',
			name: 'apiurl',
			fieldLabel: 'Detected API URL',
			value: subtunes.baseAPIURL,
			disabled: true
		}, {
			xtype: 'textfield',
			name: 'username',
			fieldLabel: 'Enter your username',
			allowBlank: false    
		}, {
			xtype: 'textfield',
			inputType:'password',
			name: 'password',
			fieldLabel: 'Enter your password',
			allowBlank: false,
			enableKeyEvents: true
		}];
    },
    
    buildButtons: function () {
    	return [{
			text: 'Log in',
			action: 'login'
		}];
    }
	
})
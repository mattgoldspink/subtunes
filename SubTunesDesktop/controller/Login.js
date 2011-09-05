Ext.define('SubTunesDesktop.controller.Login', {
    extend: 'Ext.app.Controller',
    views: [
    	'Login'
    ],
    refs: [
        {
            ref: 'form',
            selector: 'form'
        }
    ],
    init: function(application) {
    	this.control({
            'login button[action=login]': {
                click: this.loginUser
            },
            'login textfield[inputType=password]': {
                specialkey: this.handleSpecialKey
            },
            'login textfield[name=apiurl]' : {
            	afterrender: this.setApiUrl
            }
        });
		this.restApi = this.getController('SubsonicRestApiController');
    },

    doLoginIfNeeded: function(status) {
    	if (status !== 'ok') {
        	this.loginView = Ext.createWidget('login');
    		this.loginView.show();
		} else {
			
			this.postLogin();
		}
    },
    
    setApiUrl: function(textfield) {
    	textfield.setValue(this.getSettingsController().getBaseApiUrl());
    },
    
    handleSpecialKey: function(field, e) {
	    if (e.getKey() == e.ENTER) {
	    	this.loginUser();
    	}
	},
	
	getSettingsController: function(){
		if (!this.settingsController) {
			this.settingsController = this.getController('UserController');
		}
		return this.settingsController
	},

    loginUser: function(button) {
		var form = this.getForm().getForm(), 
			values = form.getValues(),
			username = values.username, 
			password = values.password,
			e = Ext,
			me = this,
			params;
		e.Msg.show({
		   msg: 'Verifying your username and password',
		   progressText: 'Checking',
		   width:300,
		   wait:true
		});
		params = {
			u: username,
			p: 'enc:' + me.application.statics.hexEncode(password)
		};
		this.restApi.ping({
		   success: me.handleloginUserSuccess,
		   failure: me.doLoginIfNeeded,
		   params: params,
		   scope: this
		});
    },
    handleloginUserSuccess: function(response, options) {
		var me = this,
			responseData = response.responseData,
			status = responseData.status,
			error = responseData.error,
			settingsController = me.getSettingsController(),
			params = options.params,
			msg = Ext.Msg;
		if (status === 'ok' && !Ext.isDefined(error)) {
			settingsController.setUsername(params.u);
			settingsController.setPassword(params.p);
			msg.hide();
			me.loginView.close();
			me.postLogin();
		} else {
			msg.hide();
			msg.setIcon(msg.ERROR);
			msg.alert('Error code: '+ responseData.error.code, 
				'There was an error logging in:<br/>'+ responseData.error.message, 
				me.resetForm, me);
		}      
    },
    resetForm: function(){
    debugger;
    	this.getForm().getForm().reset();
    },
    postLogin: function() {
		this.getController('LibraryController').syncDataWithServer();
    }
});
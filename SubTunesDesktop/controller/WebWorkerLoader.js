Ext.define('SubTunesDesktop.controller.WebWorkerLoader', {
    extend: 'Ext.app.Controller',
    //  Thread ID Cache
    _threadsById: {},
    //  Thread Cache
    _threads: [],
    //  Thread Callback Cache
    _fnCache: {},
    //  Last thread id
    _lastThreadInt: 0,
    options: {
        /**
         * jQuery.Hive.options.count -> Set property from jQuery.Hive.create( { count: [int] } ), number of threads to create
         **/
        count: 1,
        /**
         * jQuery.Hive.options.worker -> Set string property from jQuery.Hive.create( { worker: [file-name] } ), name of worker file
         **/
        worker: "",
        /**
         * jQuery.Hive.options.receive -> Set callback from jQuery.Hive.create( { receive: [callback] } ), callback to execute when worker receives message (can be global or worker specific)
         **/
        receive: Ext.emptyFn,
        /**
         * jQuery.Hive.options.created -> Set callback from jQuery.Hive.create( { created: [callback] } ), callback to execute when workers have been created
         **/
        created: Ext.emptyFn,
        /**
         * jQuery.Hive.options.special -> NOT IMPLEMENTED/INCOMPLETE  - Set callback as a second argument to $().send()
         **/
        special: "",
        /**
         * jQuery.Hive.options.error() -> NOT IMPLEMENTED/INCOMPLETE  - Error handler
         **/
        error:  function( event ) {
          //  INCOMPLETE
        }
    },
	init: function(application){
		this.addEvents('workerMessageReceived');
		this.create({
			count: 5,
			worker: 'SubTunesDesktop/LibraryLoaderWorker.js'
		});
	},
	syncDataWithServer: function(){
		var me = this.getController('SubTunesDesktop.controller.WebWorkerLoader');
		console.log('syncing with server');
		me.get.apply(me, [1]).send({ 
	
		"message" : { 
		  "a" : "a-value",
		  "b" : "b-value",
		  "c" : "c-value"
		}      
	
	  }, function (data) {
	
		console.log('RESULT: ' + data.message);
	
	  }, me);  
	},
	_addMessageListener: function(worker, callback) {
	   var me =this;
      worker.addEventListener("message", function(event) {
        var fn = callback,
            response = event.data,
            _msg;


        me.fireEvent( "workerMessageReceived", response );

        if ( response.SEND_TO ) {

          _msg  = {
            "message": response.message,
            "SEND_TO": +response.SEND_TO,
            "SEND_FROM": +response.SEND_FROM
          };

          me.get(response.SEND_TO).send(_msg);

          //  If direct message return immediately, do not fire receive callback
          return true;
        }

        return callback.call( worker, response  );

      }, false);
	},
	create: function( options ) {
		var me = this;
        //  If no worker file is specified throw exception
        if ( !me.options.worker && !options.worker ) {
          throw "No Worker file specified";
        }

        var i = 0,
        _options        = Ext.apply({}, options, me.options);
        _options.count  = options.count ? options.count : 1;

        //  If threads exist, new threads to cache
        if ( me._threads.length > 0 ) {

          //  force thread count starting position to avoid overwriting existing threads
          i = me._lastThreadInt + 1;
          //  set count to reflect added threads
          _options.count = me._lastThreadInt + _options.count + 1;
        }

        //  Create specified number of threads
        for ( ; i < _options.count; i++ ) {

          //  Create new worker thread
          var thread = new Worker( _options.worker );

          //  Garbage collect
          /*jquery( window ).unload( function() {
            thread.terminate();
          });*/

          //  Save this worker's identity
          thread.WORKER_ID  = (function(i) { return i; })(i);
          thread.id         = thread.WORKER_ID; // duplicitous... TODO: clean up

          //  Define Hive properties
          thread.send       = me.send;
          thread.special    = "";
          thread.onerror    = _options.error;

          var _wrapReceived  = function onmessage(event) {
            return _options.receive.call(me, event);
          };

          thread.receive = _wrapReceived;

          me._addMessageListener(thread, _wrapReceived);

          //  Store this callback in the Hive cache with assoc worker ID
          me._fnCache[thread.id] = {
            active: [ _wrapReceived ],
            inactive: []
          };

          //  Store this worker in the Hive cache - by ID
          me._threadsById[thread.id] = thread;

          //  Store last thread id created
          me._lastThreadInt = thread.id;

          //  Store this worker in the Hive cache
          me._threads.push( thread );
        }

        //  If a created callback is defined, wrap and fire
        if ( _options.created ) {
          me._wrapCreated = function() {
                _options.created.call(me, me._threads);
                return me._threads;
              };
          me._wrapCreated();

          me.created = me._wrapCreated;
        }

        me.fireEvent( "workerCreated" );

        //  Allows assignment to var
        return me._threads;
      },
      /**
       * jQuery.Hive.destroy( [id] ) -> destroy all or specified worker by id
       **/
      destroy:  function( id ) {

        if ( id ) {

        	this._threadsById[ id ].terminate();

          delete this._threadsById[ id ];
          delete this._fnCache[ id ];

          /*this._threads = jQuery.map(this._threads, function(obj) {
                                              if ( obj.id != id ) {
                                                return obj;
                                              }
                                            });*/
          return this._threads;
        }

        for ( var idx = 0; idx < this._threads.length; idx++ ) {
          this._threads[ idx ].terminate();
        }

        //  Delete All
        this.options.count = 0;

        this._threads = [];
        this._threadsById = {};
        this._fnCache = {};

        this.fireEvent( "workerDestroyed" );

        return this._threads;
      },
      /**
       * jQuery.Hive.get( id ).send( message, callback ) -> Send [message] to worker thread, set optional receive callback
       *  -->   SIMPLER ALTERNATIVE:  $.Hive.get(id).send( [message], function() {} )
       *  -->   Allows for passing a jQuery.Hive.get(id) object to $() ie. $( $.Hive.get(id) ).send( [message] )
       **/
      send:  function( message, /*not implemented*/callback, scope ) {

        var _msg  = message, _msgStr;

        /*not implemented*/
        if ( callback ) {
          scope._addMessageListener.apply(scope, [this, callback, true]);
        }

        //  if message is not an object (string || array)
        //  normalize it into an object
        if ( typeof message == "string" || Ext.isArray(message) ) {
          _msg  = {
            "message" : message
          };
        }

        if ( !message.SEND_FROM ) {
          _msg.SEND_FROM = this.WORKER_ID;
        }

        _msg.WORKER_ID  = this.WORKER_ID;

        this.postMessage(_msg);
        this._lastMessage = _msgStr;

        scope.fireEvent.apply(scope, ["workerMessageSent"] );

        return this;
      },
      /**
       * jQuery.Hive.get( [id] ) -> Return all or specified worker by [id], [id] argument is optional
       *  -->   $.Hive.get() returns all worker objects in the $.Hive
       *  -->   $.Hive.get(1) returns the worker object whose ID is 1
       **/
      get: function( id ) {
        if ( id !== undefined ) {
          //  Returns specified worker by [id] from private object cache
          return this._threadsById[id];
        }
        //  Returns array of all existing worker threads
        return this._threads;
      }
});

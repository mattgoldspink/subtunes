importScripts('../lib/jquery-hive/jquery.hive.pollen.js');

var makeAjaxRequest = function(url, params, recursive, requestId, searchType) {
    $.ajax.get({  
        url: url,  
        dataType:'json', 
        data: params, 
        success: function(data) {
            var results, ajaxRequestCount = 0, i = 0, track;
            try {
				// test for directory based request first
				if (data['subsonic-response'].directory) {
					results = data['subsonic-response'].directory.child;
				} else
				// test for playlist based request next
				if (data['subsonic-response'].playlist) {
					results = data['subsonic-response'].playlist.entry;
				} else 
				// handle search result
				if (data['subsonic-response'].searchResult2) {
					results = [];
					var searchResult2 = data['subsonic-response'].searchResult2;
					if (searchType === 'all' || searchType === 'artist' && searchResult2.artist) {
						var artists = searchResult2.artist;
						results = results.concat($.isArr(artists) ? artists : [artists]);
					}
					if (searchType === 'all' || searchType === 'album' && searchResult2.album) {
						var albums = searchResult2.album;
						results = results.concat($.isArr(albums) ? albums : [albums]);
					}
					if (searchType === 'all' || searchType === 'song' && searchResult2.song) {
						var songs = searchResult2.song;
						results = results.concat($.isArr(songs) ? songs : [songs]);
					}
				}
            } catch (e) {
                $.send('Failed pulling data out from');
                $.send(data);
            }
            if (results) {
                data.results = [];
                if (!$.isArr(results)) {
                    results = [results];
                }		  
                for(i = 0; i < results.length; i++) {
                    track = results[i];
                    data.results.push(track);
                }
                data.recursive = recursive;
				data.requestId = requestId;
                if (data.results.length > 0) {
                    $.send( data );
                } else {
                    $.send('No Result for ');
                    $.send( data );
                }
            } else {
                //$.send('No Result for...');
                $.send(data);
            }
        },
        failure: function(data) {
            $.send( 'Fail');   
        } 
    });   
};
var self = this;
var indexDb = self.webkitIndexedDBSync;

$(function (data) {
	for (var obj in self) {
			$.send(obj + '');
		
	}
	try {
	var db = openDatabase('subtuneslibrary', '1.1', 'subtuneslibrary');
	} catch (e) {
		$.send(e +'');
	}
  /*var params = data;
  if ($.isStr(data)) {
    params = JSON.parse(data);
  }
  self.makeAjaxRequest(params.url, params.message, params.recursive, params.requestId, params.searchType);*/
});

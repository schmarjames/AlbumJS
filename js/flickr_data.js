var flickr_data = (function() {
	
	var _loadJSON, get_album_titles, get_album_photos;
	
	_loadJSON = function(path, success, error) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
		    	if (xhr.status === 200) {
		        	if (success)
		            	success(xhr.responseText);
		            } else {
		            	if (error)
		                    error(xhr);
		            }
		        }
		    };
		xhr.open("GET", path, true);
		xhr.send();
	}
	
	return {
		set_api_key
		get_album_titles: function () {
			console.log(api_key);
		},
		get_album_photos: function () {
			
		}	
	};
	
}());
var fa = (function() {
	var main_wrap,
		api_key,
		url = 'http://api.flickr.com/services/rest/?&format=json&method=flickr.photosets.getPhotos',
		photos_sets = [],
		result_num,
		photos = {},
		results;
	
	// Model object that handles our JSON data
	var flickr_data = {
			key 		: api_key,
			loadJSON 	: function(path, callback) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if(xhr.readyState == 4 && xhr.status == 200) {
						callback(xhr.responseText.substring(6,xhr.responseText.length-1));
					}
				}
				xhr.open("GET", path, false);
				xhr.send(null);
			},
			get_album_titles : function ( p_sets, callback ) {
				var self = this,
					title_ob = {};
				// check to see if p_set is an array 
			 	if(p_sets instanceof Array) {
			 		title_ob.id = new Array;
					title_ob.title = new Array;
				 	p_sets.forEach(function(set) {
						self.loadJSON(url +'&photoset_id=' + set + '&api_key=' + api_key + '&jsoncallback=_temp', function(data) {
							if(data) {
								results = data;
							}
							if(typeof results == undefined || results.length == 0) {
							this.loadJSON(url +'&photoset_id=' + p_sets + '&api_key=' + api_key + '&jsoncallback=_temp', parseData);
							return;
						}
						results = JSON.parse(results);
						
						title_ob.id.push(results.photoset.id);
						title_ob.title.push(results.photoset.title);
							
						});	
				 	});
			 	} else {
				 	this.loadJSON(url +'&photoset_id=' + p_sets + '&api_key=' + api_key + '&jsoncallback=_temp', function(data) {
					 	if(data) {
							results = data;
						}
						if(typeof results == undefined || results.length == 0) {
							this.loadJSON(url +'&photoset_id=' + p_sets + '&api_key=' + api_key + '&jsoncallback=_temp', parseData);
							return;
						}
						results = JSON.parse(results);
						title_ob.id = results.photoset.id;
						title_ob.title = results.photoset.title;
				 	});	
			 	}
			 	
			 	return title_ob;
			},
			get_album_photos : function () { console.log("yep"); }
		};
		
	var generate_menu = function (titles) {
		console.log(titles);
		var menu_wrap = document.createElement("div"),
			album_list = document.createElement("ul");
			
			menu_wrap.setAttribute("id", "album_menu");
		
		for (var i = 0; i<titles.id.length; i++) {
			console.log(titles.id[0] + "  -  " + titles.title[0]);
			var album = document.createElement("li"),
				album_link = document.createElement("a");
			album_link.href = "#";
			album_link.title = titles.id[i];
			album_link.innerHTML = titles.title[i];
			album.appendChild(album_link);
			album_list.appendChild(album);
		}
		
		
		menu_wrap.appendChild(album_list);
		main_wrap.appendChild(menu_wrap);
		
	};
	
	var init_menu_events = function () {
		var menu = document.getElementById("album_menu"),
			menu_links = menu.querySelectorAll("li"),
			a_tag;
		console.log(menu_links);
		[].slice.call(menu_links).forEach(function(link) {
			a_tag = link.childNodes.item('a');
			a_tag.addEventListener("click", function(e) {
				e.preventDefault();
				flickr_data.get_album_photos();
			}, false);
		});
	};
	
	initmodule = function ( options ) {
			main_wrap = document.getElementById(options.wrapper);
			api_key = options.key;
			photos_sets = options.sets;
			result_num = ( isNaN(options.num) || options.num == undefined ) ? null : options.num;
			
			// Get the titles of each photo album
			var titles = flickr_data.get_album_titles( photos_sets );
			
			// Create the photo album menu and attach events to links
			generate_menu(titles);
			
			
			init_menu_events();
			
			return [api_key,photos_sets,result_num];
	};
	
	return { init : initmodule };
}());

/* 

	On start of app:
		We need to get album titles
			- model.get_album_titles
		
		Pass these titles to view module to generate menu
			- view.generate_menu
		
		Get photo_set id from menu link that has an active class
			- on load of generated menu
				- model.get_album_photos
		
	model module
	
		public function
		- get album titles
		- get album photos

*/
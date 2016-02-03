'use strict'

var NMap = function() {

	var MapModel = {
		searchText:  ko.observable(''),
		filterText: ko.observable(''),
		markerArray: ko.observableArray([]),
		placesArray: ko.observableArray([]),
		holdMarkersArray: ko.observableArray([]),
		filterArray: ko.observableArray([]),
		holdFilterMarkers: ko.observableArray([]),
		fourSquareInfoArray: ko.observableArray([]),
		holdFourSquareMarkersArray: ko.observableArray([]),
		isError: ko.observable(),
	};

	var map;
	var places = Places();
	var openInfoWindow;
	var fourSquareInfoWindow;
	var bufferFilterMarkers = ko.observableArray([]);
	var isDelete = false;
	var isBuffered = false;

	var tempString;
	MapModel.filterText.subscribe(function(newValue) {
	var arrLengthFilter = MapModel.placesArray().length;

		if(isDelete == false) {
			for(var i = 0; i < MapModel.holdFourSquareMarkersArray().length; i++) {
				MapModel.holdFourSquareMarkersArray()[i].setMap(null);
			}
			MapModel.fourSquareInfoArray.removeAll();
			isDelete = true;
		}

			filterDelete();
			MapModel.markerArray.removeAll();

			for(var i = 0; i < MapModel.holdMarkersArray().length; i++) {
				MapModel.holdMarkersArray()[i].setMap(null);
			}
			MapModel.holdMarkersArray.removeAll();

		for(var i = 0; i < arrLengthFilter; i++) {
			tempString = MapModel.placesArray()[i].title.toUpperCase();

			if(tempString.search(MapModel.filterText().toUpperCase()) > -1) {
				MapModel.markerArray.push(MapModel.placesArray()[i]);
				MapModel.holdFilterMarkers.push(bufferFilterMarkers()[i]);
			}
		}
		if(MapModel.filterText() == '') {
			MapModel.markerArray.removeAll();
			MapModel.holdMarkersArray.removeAll();//?????

			for(var i = 0; i < MapModel.placesArray().length; i++) {
				MapModel.markerArray.push(MapModel.placesArray()[i]);
			}

			setMarkers(MapModel.markerArray(), MapModel.holdMarkersArray());
			isDelete = false;
		}
		setMarkers(MapModel.markerArray(), MapModel.holdMarkersArray());
	});

	/*MapModel.filterText.subscribe(function(newValue) {
	var arrLengthFilter = MapModel.placesArray().length;
	console.log(isDelete);
		if(isDelete == false) {
			for(var i = 0; i < MapModel.holdMarkersArray().length; i++) {
				MapModel.holdMarkersArray()[i].setMap(null);
			}
			for(var i = 0; i < MapModel.holdFourSquareMarkersArray().length; i++) {
				MapModel.holdFourSquareMarkersArray()[i].setMap(null);
			}
			MapModel.fourSquareInfoArray.removeAll();
			isDelete = true;
		}

			filterDelete();
			MapModel.markerArray.removeAll();

		for(var i = 0; i < arrLengthFilter; i++) {
			tempString = MapModel.placesArray()[i].title.toUpperCase();

			if(tempString.search(MapModel.filterText().toUpperCase()) > -1) {
				MapModel.filterArray.push(MapModel.placesArray()[i]);
				MapModel.markerArray.push(MapModel.placesArray()[i]);
				MapModel.holdFilterMarkers.push(bufferFilterMarkers()[i]);
			}
		}
		if(MapModel.filterText() == '') {
			filterDelete();
			MapModel.markerArray.removeAll();

			for(var i = 0; i < MapModel.placesArray().length; i++) {
				MapModel.markerArray.push(MapModel.placesArray()[i]);
			}

			setMarkers(MapModel.markerArray(), MapModel.holdMarkersArray());
			isDelete = false;
		}

		setFilterMarkers();
	});*/

	// Initializes the arrays with data from places
	var initArrays = function() {
		var arrLength = places.myPlaces.length;
		for(var i = 0; i < arrLength; i++) {
			MapModel.placesArray.push(places.myPlaces[i]);
			MapModel.markerArray.push(places.myPlaces[i]);
		}
	};

	// Initializes google map
	function initMap() {
		var mapProp = {
			center: new google.maps.LatLng(58.144744, 7.994747),
			zoom: 13,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var nMap = new google.maps.Map(document.getElementById('map'), mapProp);
		map = nMap;
	}

	var mapError = function() {
		alert('Could not load Google Maps');
	};

	// This function creates the markers from the markerArray
	/*var setMarkers = function() {
		var arrLength = MapModel.markerArray().length;
		var initLat;
		var marker;
		var infoWindow;
		var initLng;
		var latLng;

		for(var i = 0; i < arrLength; i++) {
			initLat = MapModel.markerArray()[i].lat;
			initLng = MapModel.markerArray()[i].lng;
			latLng = {lat: initLat, lng: initLng};

			marker = new google.maps.Marker({
				position: latLng,
				animation: google.maps.Animation.DROP
			});

			infoWindow = new google.maps.InfoWindow({
				content: '<h2>' + MapModel.markerArray()[i].title + '</h2>' + '<br/>' +  '<p>' + MapModel.markerArray()[i].adr + '</p>' + '</br>' + '<a href="http://'+ MapModel.markerArray()[i].web + '" target="_blank">' + MapModel.markerArray()[i].web + '</a>' + '</p>' + '</br>' + '<p>' + MapModel.markerArray()[i].info + '</p>'
			});

			(function(infoWindow, marker) {
				marker.addListener('click', function() {

					closeLastOpenInfoWindow(openInfoWindow);
					openInfoWindow = infoWindow;
					infoWindow.open(map, marker);
					if(marker.getAnimation() != null) {
						marker.setAnimation() == null;
					} else {
						marker.setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function(){marker.setAnimation(null);}, 1400);
					}

				});
			}(infoWindow, marker));

			MapModel.holdMarkersArray.push(marker);
			marker.setMap(map);
		}
	};*/

	/*var setFilterMarkers = function() {
		var arrLength = MapModel.filterArray().length;
		var initLat;
		var marker;
		var infoWindow;
		var initLng;
		var latLng;

		for(var i = 0; i < arrLength; i++) {
			initLat = MapModel.filterArray()[i].lat;
			initLng = MapModel.filterArray()[i].lng;
			latLng = {lat: initLat, lng: initLng};

			marker = new google.maps.Marker({
				position: latLng,
			});

			infoWindow = new google.maps.InfoWindow({
				content: '<h2>' + MapModel.filterArray()[i].title + '</h2>' + '<br/>' +  '<p>' + MapModel.filterArray()[i].adr + '</p>' + '</br>' + '<a href="http://'+ MapModel.filterArray()[i].web + '" target="_blank">' + MapModel.filterArray()[i].web + '</a>' + '</p>' + '</br>' + '<p>' + MapModel.filterArray()[i].info + '</p>'
			});

			(function(infoWindow, marker) {
				marker.addListener('click', function() {

					closeLastOpenInfoWindow(openInfoWindow);
					openInfoWindow = infoWindow;
					infoWindow.open(map, marker);
					if(marker.getAnimation() != null) {
						marker.setAnimation() == null;
					} else {
						marker.setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function(){marker.setAnimation(null);}, 1400);
					}

				});
			}(infoWindow, marker));

			MapModel.holdFilterMarkers.push(marker);
			marker.setMap(map);
		}
	};*/

		var setMarkers = function(marker, holdMarker) {
		var mArr = ko.observableArray(marker);
		var arrLength = mArr().length;
		var initLat;
		var marker;
		var infoWindow;
		var initLng;
		var latLng;

		for(var i = 0; i < arrLength; i++) {
			initLat = mArr()[i].lat;
			initLng = mArr()[i].lng;
			latLng = {lat: initLat, lng: initLng};

			marker = new google.maps.Marker({
				position: latLng,
			});

			infoWindow = new google.maps.InfoWindow({
				content: '<h2>' + mArr()[i].title + '</h2>' + '<br/>' +  '<p>' + mArr()[i].adr + '</p>' + '</br>' + '<a href="http://'+ mArr()[i].web + '" target="_blank">' + mArr()[i].web + '</a>' + '</p>' + '</br>' + '<p>' + mArr()[i].info + '</p>'
			});

			(function(infoWindow, marker) {
				marker.addListener('click', function() {

					closeLastOpenInfoWindow(openInfoWindow);
					openInfoWindow = infoWindow;
					infoWindow.open(map, marker);
					if(marker.getAnimation() != null) {
						marker.setAnimation() == null;
					} else {
						marker.setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function(){marker.setAnimation(null);}, 1400);
					}

				});
			}(infoWindow, marker));
			if(isBuffered == false) {
				bufferFilterMarkers.push(marker);
			}
			holdMarker.push(marker);
			marker.setMap(map);
		}
		console.log(isBuffered);
		isBuffered = true;
	};

	var closeLastOpenInfoWindow = function(window) {
		if(window) {
			window.close();
		}
	};

	// This function call deleteMarkers function.
	// Checkes if the value typed in the searchText is equal to
	// some of the names from the placesArray.
	// If there is a match it will be pushed to markerArray.
	// The setMarkers and getFourSquareInfo is called
	var search = function() {
		deleteMarkers();

		getFourSquareInfo(MapModel.searchText());
	};


	function deleteMarkers() {
		var arrLength = MapModel.holdMarkersArray().length;
			for(var i = 0; i < arrLength; i++) {
				MapModel.holdMarkersArray()[i].setMap(null);
			}

		//MapModel.markerArray.removeAll();
		//MapModel.holdMarkersArray.removeAll();
	}

	var filterDelete = function() {
		var arrLength = MapModel.holdFilterMarkers().length;

		for(var i = 0; i < arrLength; i++) {
			MapModel.holdFilterMarkers()[i].setMap(null);
		}

		MapModel.filterArray.removeAll();
		MapModel.holdFilterMarkers.removeAll();
	};

	// Gets the item that is clicked in the array.
	// Goes through the markerArray, and checks if the data.title
	// is equal to a title in the markerArray.
	// If it is, index is set to the i value of the array
	// linkClick is called with the ndex value
	var openInfo = function(data) {i
		var arrLength = MapModel.markerArray().length;
		var index;

		for(var i = 0; i < arrLength; i++) {
			if(data.title == MapModel.markerArray()[i].title){
				index = i;
			}
		}
		linkClick(index, MapModel.holdMarkersArray());
	};

	// Triggers the marker click event from a table cell
	var linkClick = function(id, arrayOfMarkers) {
		var mArr = ko.observableArray(arrayOfMarkers);
		google.maps.event.trigger(mArr()[id], 'click');
	};

	/*var linkClick = function(id) {
		google.maps.event.trigger(MapModel.holdMarkersArray()[id], 'click');
	};*/

	// This function uses the Four Square API
	// uses $getJSon to get information fron Four Square
	var getFourSquareInfo = function(searhQuery) {
		var venues;

		var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?client_id=RU3QTW3F1CUFGAZQM5KGLZSJHV5BVIBY0XDXODIED2CKR4BL&client_secret=YB04C05RQWLCRL2Y1U1KFZKGHKSCUSQ10SZ5VLRHRKJS0UCS&v=20130815&ll=58,8&ll=58.144744, 7.994747&radius=1500&query=' + searhQuery + '';
		var fourSquareInfoWindow;

		MapModel.fourSquareInfoArray.removeAll();

		$.getJSON(fourSquareURL, function(data) {
			venues = data.response.venues;
			console.log(venues);
			for(var i = 0; i < venues.length; i++) {
				MapModel.fourSquareInfoArray.push(venues[i]);
			}
			if(MapModel.holdFourSquareMarkersArray().length > 0) {
				deleteFourSquareMarkers();
				MapModel.holdFourSquareMarkersArray.removeAll();
			}
			fourSquareMarkers();
			MapModel.isError(false);
		}).fail(function(e) {
			MapModel.isError(true);
		});
	};

	// Creates markers for the information that is returned from Four Square.
	// Also creates the Info Window for the markers. The information that goes
	// into these infoWindows is just the name, since Four Square did not manage to
	// return an adress on all the searches i tried
	var fourSquareMarkers = function() {
		var arrLength = MapModel.fourSquareInfoArray().length;
		var lat;
		var lng;
		var latLng;
		var marker;
		var markerInfo;
		var infoWindow;

		for(var i = 0; i < arrLength; i++) {
			lat = MapModel.fourSquareInfoArray()[i].location.lat;
			lng = MapModel.fourSquareInfoArray()[i].location.lng;
			markerInfo = '<h2>' + MapModel.fourSquareInfoArray()[i].name + '</h2>';
			latLng = {lat: lat, lng: lng};

			marker = new google.maps.Marker({
				position: latLng,
				animation: google.maps.Animation.DROP
			});

			infoWindow = new google.maps.InfoWindow({
				content: markerInfo
			});

			(function(infoWindow, marker) {

				marker.addListener('click', function() {
					closeLastOpenInfoWindow(fourSquareInfoWindow);
					fourSquareInfoWindow = infoWindow;
					infoWindow.open(map, marker);

					if(marker.getAnimation() !== null) {
						marker.setAnimation() === null;
					} else {
						marker.setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function(){marker.setAnimation(null);}, 1400);
					}
				});
			}(infoWindow, marker));

			MapModel.holdFourSquareMarkersArray.push(marker);
			marker.setMap(map);
		}
	};

	// Deletes the markers in the holdFourSquareMarkersArray
	var deleteFourSquareMarkers = function() {
		var arrLength = MapModel.holdFourSquareMarkersArray().length;
		for(var i = 0; i < arrLength; i++) {
					MapModel.holdFourSquareMarkersArray()[i].setMap(null);
				}
				MapModel.holdFourSquareMarkersArray.removeAll();
	};

	var openFSInfo = function(data) {
		var index;
		var arrLength = MapModel.fourSquareInfoArray().length;

		for(var i = 0; i < arrLength; i++) {
			if(data.name == MapModel.fourSquareInfoArray()[i].name) {
				index = i;
			}
		}
		linkClick(index, MapModel.holdFourSquareMarkersArray());
	};

	// Calls the functions that are necessary for the application to run
	var init = function() {
		initMap();
		initArrays();
		setMarkers(MapModel.markerArray(), MapModel.holdMarkersArray());
		ko.applyBindings(MapModel);
	};

	// Set the returned content as public
	return {
		MapModel: MapModel,
		search: search,
		openInfo: openInfo,
		openFSInfo: openFSInfo,
		mapError: mapError,
		init: init,
	};

}();
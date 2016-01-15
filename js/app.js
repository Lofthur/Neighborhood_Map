'use strict';

var NMap = function() {

	var MapModel = {
		searchText:  ko.observable(),
		markerArray: ko.observableArray([]),
		placesArray: ko.observableArray([]),
		holdMarkersArray: ko.observableArray([]),
		fourSquareInfoArray: ko.observableArray([]),
		holdFourSquareMarkersArray: ko.observableArray([]),
		isError: ko.observable()
	};

	var map;
	var places = Places();
	var openInfoWindow;

	// Initializes the arrays with data from places
	var initArrays = function() {
		var arrLength = places.myPlaces.length;
		for(var i = 0; i < arrLength; i++) {
			MapModel.placesArray.push(places.myPlaces[i]);
			MapModel.markerArray.push(places.myPlaces[i]);
		}
	};

	// Initializes google map
	var initMap = function() {
		var mapProp = {
			center: new google.maps.LatLng(58.144744, 7.994747),
			zoom: 13,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var nMap = new google.maps.Map(document.getElementById('map'), mapProp);
		map = nMap;
	};

	// This function creates the markers from the markerArray
	var setMarkers = function() {
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
				content: '<h2>' + MapModel.markerArray()[i].title + '</h2>' + '<br/>' +  '<p>' + MapModel.markerArray()[i].info + '</p>'
			});

			(function(infoWindow, marker) {
				marker.addListener('click', function() {

					closeLastOpenInfoWindow();
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
	};

	var closeLastOpenInfoWindow = function() {
		if(openInfoWindow) {
			openInfoWindow.close();
		}
	};

	// This function call deleteMarkers function.
	// Checkes if the value typed in the searchText is equal to
	// some of the names from the placesArray.
	// If there is a match it will be pushed to markerArray.
	// The setMarkers and getFourSquareInfo is called
	var search = function() {
		var arrLength = MapModel.placesArray().length;

		deleteMarkers(MapModel.markerArray(), MapModel.holdMarkersArray());
		for(var i = 0; i < arrLength; i++) {
			if(MapModel.searchText().toUpperCase() == MapModel.placesArray()[i].title.toUpperCase()) {
				MapModel.markerArray.push(MapModel.placesArray()[i]);
			}
		}
		setMarkers();
		getFourSquareInfo(MapModel.searchText());
	};

	// Deletes the information that is inside markerArray
	// and holdMarkerArray
	var deleteMarkers = function() {
		var arrLength = MapModel.markerArray().length;

		for(var i = 0; i < arrLength; i++) {
			MapModel.holdMarkersArray()[i].setMap(null);
		}
		MapModel.markerArray.removeAll();
		MapModel.holdMarkersArray.removeAll();
	};

	// Gets the item that is clicked in the array.
	// Goes through the markerArray, and checks if the data.title
	// is equal to a title in the markerArray.
	// If it is, index is set to the i value of the array
	// linkClick is called with the index value
	var openInfo = function(data) {
		var arrLength = MapModel.markerArray().length;
		var index;
		for(var i = 0; i < arrLength; i++) {
			if(data.title == MapModel.markerArray()[i].title){
				index = i;
			}
		}
		linkClick(index);
	};
	// Triggers the marker click event from a table cell
	var linkClick = function(id) {
		google.maps.event.trigger(MapModel.holdMarkersArray()[id], 'click');
	};

	// This function uses the Four Square API
	// uses $getJSon to get information fron Four Square
	var getFourSquareInfo = function(searhQuery) {
		var venues;
		var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?client_id=RU3QTW3F1CUFGAZQM5KGLZSJHV5BVIBY0XDXODIED2CKR4BL&client_secret=YB04C05RQWLCRL2Y1U1KFZKGHKSCUSQ10SZ5VLRHRKJS0UCS&v=20130815&ll=58,8&ll=58.144744, 7.994747&radius=1500&query=' + searhQuery + '';


		MapModel.fourSquareInfoArray.removeAll();

		$.getJSON(fourSquareURL, function(data) {
			venues = data.response.venues;
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
			markerInfo = MapModel.fourSquareInfoArray()[i].name;
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

	// Calls the functions that are necessary for the application to run
	var init = function() {
		initMap();
		initArrays();
		setMarkers();
		ko.applyBindings(MapModel);
	};

	// Calls the init function when the document is ready
	$(init);

	// Set the returned content as public
	return {
		MapModel: MapModel,
		search: search,
		openInfo: openInfo
	};

}();
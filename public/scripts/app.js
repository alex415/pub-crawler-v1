angular.module('pubCrawl', ['ngAutocomplete', 'ngMap', 'ngRoute'])

.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/templates/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }])

.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.myValue = false;
  var markers = [];

  $scope.submit = function () {

    // send user's location to foursquare API
    $scope.startLocation = $scope.details.geometry.location.toString().replace(/\s+/, '').slice(1, -1);
    var url = 'https://api.foursquare.com/v2/venues/explore?client_id=0LQEK2QFONRMHNYOBLU4ZEMSGKGWAB5J51O4JB0DPYRNW41G&client_secret=JYZ2IHWEDEKK5A3HNQKO4ELARI55YOJP0LFOF1NFM3R3LY5Z&v=20150901&ll=' + $scope.startLocation + '&query=drinks&limit=10&radius=1500';
    $http.get(url)
      .then(function (response) {
        $scope.bars = response.data.response.groups[0].items;

        // loop map markers
        for (var i=0; i < $scope.bars.length; i++) {
          markers[i] = new google.maps.Marker({
            // title: "Hi marker" + i
          });
        }

        // generate map markers
        $scope.GenerateMapMarkers();
    });
  };

  // create markers on map
  $scope.GenerateMapMarkers = function() {
    var numMarkers = $scope.bars.length;
    for (i = 0; i < numMarkers; i++) {
      var lat = $scope.bars[i].venue.location.lat;
      var lng = $scope.bars[i].venue.location.lng;
      var latlng = new google.maps.LatLng(lat, lng);
      markers[i].setPosition(latlng);
      markers[i].setMap($scope.map);
    }
  };

  // create info window on map
  $scope.$on('mapInitialized', function (event, map) {
    $scope.objMapa = map;
  });

  $scope.showInfoWindow = function (event, bar) {
    if ($scope.infowindow) {
      $scope.infowindow.close();
    }
    $scope.infowindow = new google.maps.InfoWindow();
    var center = new google.maps.LatLng(bar.venue.location.lat,bar.venue.location.lng);

    $scope.infowindow.setContent(
      '<small>' + bar.venue.name + '</small>' + '<br>' +
      '<small>' + bar.venue.location.formattedAddress.join(" ") + '</small>');

    $scope.infowindow.setPosition(center);
    $scope.infowindow.open($scope.objMapa);
  };

  // get foursquare pictures
  $scope.getPictures = function (bar) {
    var foursquareId = bar.venue.id;
    var url = 'https://api.foursquare.com/v2/venues/' + foursquareId +'/photos?client_id=0LQEK2QFONRMHNYOBLU4ZEMSGKGWAB5J51O4JB0DPYRNW41G&client_secret=JYZ2IHWEDEKK5A3HNQKO4ELARI55YOJP0LFOF1NFM3R3LY5Z&v=20150901';
    $http.get(url)
      .then(function (response) {
        $scope.pictures = response.data.response.photos.items;
    });
  };

}]);
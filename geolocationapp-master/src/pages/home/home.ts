import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { } from '@types/googlemaps';



// I commented this so you better be looking at it

var mapDisplayed = 0;

var adminArea;
var footerInfo;

var location = {
  postCode: "",
  adminArea: "",
  adminCounty: "",
  locationInformation: ""
};
var weather = {
  weather: "",
  weatherInformation: ""
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  appPostCode: string;
  appWeather: string;
  appAdminArea: string;
  appFooter: string = "Tap Anywhere For Local Information";

  constructor(public navCtrl: NavController) {

  }

  footerInfo(e) {
    this.appFooter = "";
  }

  initMap(e) {

    var userCoords
    var map;

    function showMap(position) {

      var userPosition = position;
      getUserLocation(userPosition);

      if (mapDisplayed == 0) {
        map = new google.maps.Map(document.getElementById('map'), {
          center: userCoords,
          zoom: 15
        });
        mapDisplayed = 1;
      }
      getPostCode();
      getWeather();
      getSomething();
      drawMarker();
    }
    function dontShowMap() {
      //something to tell them theyve been naughty not allowing me to see wheere i am
    }
    //decides which method to run based on whether or not the user has given the app permission to view location
    if (mapDisplayed == 0) {
      navigator.geolocation.getCurrentPosition(showMap, dontShowMap);
    }

    function getUserLocation(userPosition) {
      userCoords = { lat: userPosition.coords.latitude, lng: userPosition.coords.longitude };
      console.log(userCoords);
    }
    function drawMarker() {
      var marker = new google.maps.Marker({
        position: userCoords,
        map: map
      });

      var contentString = '<h1>Your Location</h1>' +
        '<p>' + location.locationInformation + '</P>' +
        '<p>' + weather.weatherInformation + '</P>';

      var infoWindow = drawInfoWindow(contentString);
      marker.addListener('click', function () {
        infoWindow.open(map, marker);
      });
    }

    function drawInfoWindow(contentString) {  
      var infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
      return infoWindow;
    }
    
    // gets postcode based upon lat+lon from postcodes.io or postcode.io
    // didnt think i could get the weather from lon and lat so i did this first, didnt actually need to do it
    function getPostCode() {
      var req = new XMLHttpRequest()
      req.open("GET", "http://api.postcodes.io/postcodes?lon=" + userCoords.lng + "&lat=" + userCoords.lat, false);
      req.send(null);

      var r = JSON.parse(req.response);
      location.postCode = r.result[0].postcode;
      location.adminArea = r.result[0].admin_district;
      location.adminCounty = r.result[0].admin_county;
      console.log("postcode: " + location.postCode);
      location.locationInformation = "This Location Is: " + location.postCode + ", " + location.adminArea + ", " + location.adminCounty + ".";
    }

    // gets weather based upon lon+lat from openweather
    function getWeather() {
      var req = new XMLHttpRequest()
      req.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + userCoords.lat + "&lon=" + userCoords.lng + "&APPID=7f6c7a16080ef8a18af35d11d9a891bb", false);
      req.send(null);

      var r = JSON.parse(req.response);
      weather.weather = r.weather[0].description;
      console.log("weather is:" + weather.weather);
      weather.weatherInformation = "Expect " + weather.weather + ".";
    }

    var markersWanted = "cafe";
    var marketsWantedInfoWindow;
    function getSomething() {
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: userCoords,
        radius: 50000,
        type: markersWanted
      }, createMarkersWanted)
    }

    function createMarkersWanted(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i])
        }
      }
    }

    function createMarker(place) {          
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });
      var contentString = "<h5>"+place.name+"</h5>";

      var infoWindow = drawInfoWindow(contentString);
      marker.addListener('click', function () {
        infoWindow.open(map, marker);
      });
    }   
  }
}
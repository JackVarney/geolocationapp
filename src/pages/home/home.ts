import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { } from '@types/googlemaps';



//var drawingManager;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  initMap() {

    var map;
    var longitude = 0;
    var latitude = 0;
    var postCode;
    var weather;

    function showMap(position) {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;

      console.log(longitude, latitude);

      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 15
      });      
      getPostCode();
      getWeather();
    }

    function dontShowMap() {
      //something to tell them theyve been naughty not allowing me to see wheere i am
    }

    navigator.geolocation.getCurrentPosition(showMap, dontShowMap);

    function getPostCode() {
        var req = new XMLHttpRequest()
        req.open("GET", "http://api.postcodes.io/postcodes?lon=" + longitude + "&lat=" + latitude, false);
        req.send(null);

        var r = JSON.parse(req.response);
        postCode = r.result[0].postcode;
        console.log("postcode: " + postCode);
      }

    function getWeather() {

      var req = new XMLHttpRequest()
     // req.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude, false);
      req.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&APPID=7f6c7a16080ef8a18af35d11d9a891bb", false);
      req.send(null);

      var r = JSON.parse(req.response);
      var weather = r.weather[0].main;
      console.log("weather is:"+weather);      
    }




  }
}
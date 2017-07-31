import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { } from '@types/googlemaps';



// I commented this so you better be looking at it

var postCode;
var weather;
var adminArea;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage {  

  appPostCode: string;
  appWeather: string;
  appAdminArea: string;  

  constructor(public navCtrl: NavController) {
    
  }  

  runClick(){
    this.appPostCode = postCode.postCode;
    this.appWeather = weather.weather;
    this.appAdminArea = adminArea.adminArea;     
  }

  initMap(e) {

    var userCoords
    var map;      

    // this method gets the longitude and latitude

    function showMap(position) {  

      userCoords = {lat: position.coords.latitude, lon: position.coords.longitude};
      
      map = new google.maps.Map(document.getElementById('map'), {
        center: userCoords,
        zoom: 15
      });

      getPostCode();
      getWeather();

    }    

    function getUserLocation(userPosition){
      userCoords = {lat: userPosition.coords.lon, lon: userPosition.coords.lat};
    }

    function dontShowMap() {
      //something to tell them theyve been naughty not allowing me to see wheere i am
    }

    //decides which method to run based on whether or not the user has given the app permission to view location
    navigator.geolocation.getCurrentPosition(showMap, dontShowMap);

    

    // gets postcode based upon lat+lon from postcodes.io or postcode.io
    // didnt think i could get the weather from lon and lat so i did this first, didnt actually need to do it
    function getPostCode() {
      var req = new XMLHttpRequest()
      req.open("GET", "http://api.postcodes.io/postcodes?lon=" + userCoords.lon + "&lat=" + userCoords.lat, false);
      req.send(null);

      var r = JSON.parse(req.response);
      postCode = r.result[0].postcode;
      adminArea = r.adminArea[0].admin_district;
      console.log("postcode: " + postCode);       
      
      return postCode;
    }

    // gets weather based upon lon+lat from openweather
    function getWeather() {

      var req = new XMLHttpRequest()
      req.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + userCoords.lat + "&lon=" + userCoords.lon + "&APPID=7f6c7a16080ef8a18af35d11d9a891bb", false);
      req.send(null);

      var r = JSON.parse(req.response);
      weather = r.weather[0].main;
      console.log("weather is:" + weather);
    }   
  }  
}
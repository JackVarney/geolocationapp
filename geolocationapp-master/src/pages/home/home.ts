import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { } from '@types/googlemaps';



// I commented this so you better be looking at it

var latitude = 0;
var longitude = 0;
var postCode;
var weather;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})



export class HomePage {  


  //  https://stackoverflow.com/questions/34714462/updating-variable-changes-in-components-from-a-service-with-angular2
  appPostCode: string;
  appWeather: string;

  constructor(public navCtrl: NavController) {
    
  }  

  runClick(){
    this.appPostCode = postCode;
    this.appWeather = weather;
  }

  initMap(e) {

    var map;    
    var weather;

    // this method gets the longitude and latitude

    function showMap(position) {

      //I would like to perform the below 2 lines of code in a seperate function however I couldnt figure out how to
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


    // gets postcode based upon lat+lon from postcodes.io or postcode.io
    // didnt think i could get the weather from lon and lat so i did this first, didnt actually need to do it
    function getPostCode() {
      var req = new XMLHttpRequest()
      req.open("GET", "http://api.postcodes.io/postcodes?lon=" + longitude + "&lat=" + latitude, false);
      req.send(null);

      var r = JSON.parse(req.response);
      postCode = r.result[0].postcode;
      console.log("postcode: " + postCode);       
      
      return postCode;
    }

    // gets weather based upon lon+lat from openweather
    function getWeather() {

      var req = new XMLHttpRequest()
      req.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=7f6c7a16080ef8a18af35d11d9a891bb", false);
      req.send(null);

      var r = JSON.parse(req.response);
      weather = r.weather[0].main;
      console.log("weather is:" + weather);
    }   
  }  
}
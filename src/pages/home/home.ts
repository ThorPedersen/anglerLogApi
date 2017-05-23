import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { SimpleCatch } from '../../models/catches';
import { WeatherObject } from '../../models/weather';
import { Geolocation } from '@ionic-native/geolocation';

import { MapPage } from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public list: boolean[] = [];
  private storage:Storage;
  public shownGroup;

  public currentCatch:SimpleCatch = new SimpleCatch();
  public catches:Array<SimpleCatch> = new Array<SimpleCatch>();
  public weather:WeatherObject = new WeatherObject();

  constructor(public navCtrl: NavController, public http:Http, private geolocation: Geolocation, storages: Storage) {

    this.storage = storages;
    
    http.get("api/catches")
    .subscribe(
      data => {
        this.catches = data.json().catches;
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      
      //This is how the code should be, and it sometimes work in edge and chrome, and sometimes not. Should be identical to Kim whose code does work.
      //could possibly be an issue with Google
      this.currentCatch.latitude = data.coords.latitude;
      this.currentCatch.longitude = data.coords.longitude;

      //this.currentCatch.latitude = 55.531118;
      //this.currentCatch.longitude = 11.837494;

      http.get("Weatherapi/weather?lat=" + this.currentCatch.latitude + "&lon=" + this.currentCatch.longitude + "&units=metric&appid=5e8ca396b0b5be1ddec6aa9d0b3b0d37")
      .subscribe(
        data => this.weather = data.json(), null, () => { this.currentCatch.weather = this.weather.weather[0].description; this.currentCatch.location = this.weather.name });
    });
  }
  ionViewDidEnter()
  {
      this.currentCatch.datetime = this.formatLocalDate();

      this.storage.ready().then(() => {
        this.storage.get('settings').then((val) => {
          if(val == null)
          {
            this.list = [true, true, true, true, true, true, true, false, false];
            this.storage.set('settings', this.list);
          }
          else
          {
            this.list = val;
          }
        })
      });
  }
  public isGroupShown(group) {
    return this.shownGroup === group;
  };

  public toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  public addCatch() 
  {   
    alert(JSON.stringify(this.currentCatch));
    this.http.post("api/catches", JSON.stringify(this.currentCatch))
    .subscribe(
      (val) => { alert("data succesfully send! " + val.text())},
      (err) => { alert("No data received! " + err ) },
      ()    => { alert("task completed?") }
    )
    
  }
  public formatLocalDate() {
    var now = new Date(),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return now.getFullYear() 
        + '-' + pad(now.getMonth()+1)
        + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours())
        + ':' + pad(now.getMinutes()) 
        + ':' + pad(now.getSeconds()) 
        + dif + pad(tzo / 60) 
        + ':' + pad(tzo % 60);
  }
  public checkOnMap($latitude:number, $longitude:number)
  {
    this.navCtrl.push(MapPage, {
      firstpassed: $latitude,
      secondpassed: $longitude
    });
    console.log("Latitude: " + $latitude + ". Longitude: " + $longitude)
  }
}

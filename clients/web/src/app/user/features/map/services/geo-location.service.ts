import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocationResponse, LocationResponseObject, Location } from '../../profile/interfaces/user'; 

declare const google: any;

interface Position {
  coords: {
    latitude: number,
    longitude: number
  }
}

// TODO: rename to location service
@Injectable({
	providedIn: 'root',
})
export class GeoLocationService {

  baseUrl = environment.backendUrl;

  coordinates = {
    latitude: 48.8566,
    longitude: 2.3522
  }
  formattedAddress: string | null = null;

  addressFetched: boolean = false;

  private geocoder;

  constructor(
    private http: HttpClient
  ) { }

  private fetchLocation() {
    const url = `${this.baseUrl}/users/current/location`;
    return this.http.get(url);
  }

  public getPosition(): Observable<Position> {
    return Observable.create(
      (observer) => {
        this.fetchLocation().pipe(map((res: LocationResponse) => res.location))
        .subscribe((location: LocationResponseObject) => {
          this.coordinates = {
            latitude: parseFloat(location.lat.$numberDecimal),
            longitude: parseFloat(location.lng.$numberDecimal),
          };
          this.formattedAddress = location.formattedAddress;
          this.addressFetched = true;
          observer.next({
            coords: this.coordinates
          });
        }, (err) => {
          navigator.geolocation.getCurrentPosition(
            (pos: Position) => {
              if (pos.coords !== undefined) {
                this.coordinates = pos.coords;
                this.updateFormattedAddress();
                observer.next(pos);
              }
            }, (err) => {
              if (!!err.code) {
                console.log(err.code);
                // prompt user to manually input location
              }
            },
          ),
          { enableHighAccuracy: true };
        });
      }
    );
  }

  public async updateFormattedAddress()  {
    if (!this.formattedAddress) {
      if (this.geocoder === undefined) {
        this.geocoder = new google.maps.Geocoder;
      }
      await this.geocoder.geocode({ 
        'location': { 
          lat: this.coordinates.latitude, 
          lng: this.coordinates.longitude 
        }}, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              this.formattedAddress = results[0].formatted_address;
              this.addressFetched = true;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        }
      )
    }
  }

  public setNewPlace(lat, lng, formattedAddress) {
    this.coordinates=  {
      latitude: lat, 
      longitude: lng
    };
    this.formattedAddress = formattedAddress;
    this.addressFetched = true;
  }
}
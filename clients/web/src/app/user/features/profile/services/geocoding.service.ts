import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private locationIqAPIKey = "pk.746b89073c326404012d2b3f611d951d";

  private geocoder: any;

  private initGeocoder() {
    const options = {
      provider: 'locationiq',
      apiKey: this.locationIqAPIKey
    };
  }

  constructor(
    private http: HttpClient
  ) { 
    this.initGeocoder();
  }

  getAddressFromLatLng(lat: number, lng: number) {
    const stringLat = lat.toString();
    const stringLng = lng.toString();
    const url = `https://eu1.locationiq.com/v1/reverse.php?key=${this.locationIqAPIKey}&lat=${stringLat}lon=${stringLng}&format=json`;
    return this.http.get(url);
  }

  getFullLocationFromAddress(address: string) {
  }


  autocompleteSearchRequest(search: string) {
    const url = `https://eu1.locationiq.com/v1/autocomplete.php?key=${this.locationIqAPIKey}&q=${search}`;
    return this.http.get(url);
  }

}

import { Component, Input, ViewChild,  OnInit, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GeoLocationService } from '../../services/geo-location.service';
import { TherapistsService } from '../../services/therapists.service';

import { Location, LocationResponse, LocationResponseObject, Position } from '../../../profile/interfaces/user';
import * as L from 'leaflet';
/* importing accurate position plugin so it affects leaflet package */
import '../../../../../../../plugins/leaflet/Leaflet.AccuratePosition.js';
import { GeocodingService } from '../../../profile/services/geocoding.service';
import { ProfileService } from '../../../profile/services/profile.service';

var map: any;

@Component({
  selector: 'app-address-input-modal',
  templateUrl: './address-input-modal.component.html',
  styleUrls: ['./address-input-modal.component.scss']
})
export class AddressInputModalComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapContainer;

  @Output() closeModal = new EventEmitter<boolean>();
  
  locationExistsInDb: boolean = false;
  address: FormControl;

  addressInSearch: boolean = false;
  addressConfirmed: boolean = false;
  addressChangesMade: boolean = false;
  addressSearchResult$: BehaviorSubject<Location> = null;
  locationOut: Location;

  constructor(
    private cdr: ChangeDetectorRef,
    private geocoder: GeocodingService,
    private gls: GeoLocationService,
    private ts: TherapistsService,
    private ps: ProfileService
  ) { 
    this.ps.getLocation().subscribe((res) =>{
      if (!res)
        this.locationExistsInDb = false;
      else
        this.locationExistsInDb = true
    } 
    , (err) => this.locationExistsInDb = false);
  }


  private initMap(): void {
    map = L.map(this.mapContainer.nativeElement, {
      center: [ 46.71, 1.72 ],
      zoom: 4
    });

    /* geolocation */
    map.on('accuratepositionfound', this.onAccuratePositionFound);
    map.on('accuratepositionerror', this.onAccuratePositionError);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(map);
  }

  private updateAddressControl(lat: number, lng: number) {
    this.geocoder.getAddressFromLatLng(lat, lng).subscribe((res: any) => {
      let tmpLocation = this.addressSearchResult$.getValue();
      tmpLocation.lat = parseFloat(res.lat);
      tmpLocation.lng = parseFloat(res.lon);
      tmpLocation.formattedAddress = (
        (res.address.house_number ? res.address.house_number : '<numéro>') +
        ' ' + (res.address.road ? res.address.road : '<rue>') +
        ', ' + (res.address.postcode ? res.address.postcode : '<code postal>') +
        ' ' + (res.address.city? res.address.city : res.address.state) 
      );
      this.addressSearchResult$.next(tmpLocation);
      this.address.setValue(tmpLocation.formattedAddress);
      this.cdr.detectChanges();
    });
  }

  private onAccuratePositionFound (e) {
    map.flyTo(e.latlng, 13);
    this.updateAddressControl(e.latlng.lat, e.latlng.lng);
  }


  private onAccuratePositionError (e) {
      console.log(e.message)
  }


  ngOnInit() {
    this.address = new FormControl('');
    this.addressInSearch = false;
    
    this.addressSearchResult$ = new BehaviorSubject({
      _id: "", lat: 0, lng: 0, formattedAddress: ""
    });

    this.address.valueChanges.pipe(
        tap((_) => this.addressInSearch = true),
        debounceTime(500),
        distinctUntilChanged() 
    ).subscribe((val) => {
      this.geocoder.autocompleteSearchRequest(val).subscribe((searchRes: any) => {
        searchRes = searchRes[0];
        let tmpLocation = this.addressSearchResult$.getValue();
        tmpLocation.lat = parseFloat(searchRes.lat);
        tmpLocation.lng = parseFloat(searchRes.lon);
        tmpLocation.formattedAddress = (
          searchRes.address.house_number +
          ' ' + searchRes.address.road +
          ', ' + searchRes.address.postcode +
          ' ' + searchRes.address.city 
        );
        this.addressSearchResult$.next(tmpLocation);
      }, (err) => console.log(err));
    });
  }


  ngAfterViewInit() {
    this.initMap();
  }

  onAddressSearchConfirm() {
    this.addressInSearch = false;
    this.addressConfirmed = true;
    let addressSearchRes = this.addressSearchResult$.getValue(); 
    map.flyTo(L.latLng(addressSearchRes.lat, addressSearchRes.lng), 13);
    this.address.setValue(addressSearchRes.formattedAddress);
    if (!this.locationOut)
      this.locationOut = {
        _id: '',
        lat: addressSearchRes.lat,
        lng: addressSearchRes.lng,
        formattedAddress: addressSearchRes.formattedAddress
      }
    else {
      this.locationOut.lat = addressSearchRes.lat;
      this.locationOut.lng = addressSearchRes.lng;
      this.locationOut.formattedAddress = addressSearchRes.formattedAddress;
    }
    this.addressChangesMade = true;
    this.cdr.detectChanges();
  }


  registerNewPlace() {
    if (this.addressChangesMade)
      this.ps.updateLocation(
        this.locationOut.lat,
        this.locationOut.lng,
        this.locationOut.formattedAddress,
        this.locationExistsInDb
      ).subscribe((_) => {
        this.gls.setNewPlace(this.locationOut.lat, this.locationOut.lng, this.locationOut.formattedAddress);
        this.ts.getTherapists(this.locationOut.lat, this.locationOut.lng);
        this.closeModal.emit(true);
      });
  }
}

import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Therapist } from '../../interfaces/therapist';
import { Location, Position } from '../../interfaces/location';
import * as L from 'leaflet';
/* importing accurate position plugin so it affects leaflet package */
import '../../../../../../../plugins/leaflet/Leaflet.AccuratePosition.js';
import { GeocodingService } from '../../services/geocoding.service';
import { ProfileService } from '../../services/profile.service';


var map: any;


@Component({
  selector: 'app-basic-info-modal',
  templateUrl: './basic-info-modal.component.html',
  styleUrls: ['./basic-info-modal.component.scss']
})
export class BasicInfoModalComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapContainer;

  @Input() therapist: Therapist;
  @Input() location: Location;
  @Output() modalClosedEvent = new EventEmitter();
  @Output() changesMadeEvent = new EventEmitter();
  basicChangesMade: boolean = false;
  addressChangesMade: boolean = false;

  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  phoneNumber: FormControl;
  address: FormControl;

  addressInSearch: boolean = false;
  addressConfirmed: boolean = false;
  addressSearchResult$: BehaviorSubject<Location> = null;
  locationOut: Location;

  constructor(
    private geocoder: GeocodingService,
    private cdr: ChangeDetectorRef,
    private ps: ProfileService
  ) { }
  


  private initMap(): void {
    map = L.map(this.mapContainer.nativeElement, {
      center: [ 46.71, 1.72 ],
      zoom: 4
    });

    /* geolocation */
    map.on('accuratepositionfound', this.onAccuratePositionFound, this);
    map.on('accuratepositionerror', this.onAccuratePositionError, this);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(map);
  }


  private updateAddressControl(lat: number, lng: number) {
    this.geocoder.getAddressFromLatLng(lat, lng).subscribe((res: any) => {
      console.log('RES: ', res);
      let tmpLocation = this.addressSearchResult$.getValue();
      tmpLocation.lat = parseFloat(res.lat);
      tmpLocation.lng = parseFloat(res.lon);
      console.log(res.address.road + ' ' + typeof(res.address.road));
      console.log(res.address.house_number + ' ' + typeof(res.address.house_number));
      console.log(res.address.postcode + ' ' + typeof(res.address.postcode));
      console.log(res.address.city + ' ' + typeof(res.address.city));
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
    this.addressInSearch = false;


    this.firstName = new FormControl(this.therapist.firstName);
    this.lastName = new FormControl(this.therapist.lastName);
    this.email = new FormControl(this.therapist.email);
    this.phoneNumber = new FormControl(this.therapist.phoneNumber);
    this.address = new FormControl(this.location?.formattedAddress);
    
    this.addressSearchResult$ = (this.location) ? new BehaviorSubject<Location>(this.location) : new BehaviorSubject({
      _id: "", lat: 0, lng: 0, formattedAddress: ""
    });

    this.address.valueChanges.pipe(
        tap((_) => this.addressInSearch = true),
        debounceTime(500),
        distinctUntilChanged() 
    ).subscribe((val) => {
      val = val.replace("undefined", "");
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
    this.firstName.valueChanges.subscribe((_) => this.basicChangesMade = true);
    this.lastName.valueChanges.subscribe((_) => this.basicChangesMade = true);
    this.email.valueChanges.subscribe((_) => this.basicChangesMade = true);
    this.phoneNumber.valueChanges.subscribe((_) => this.basicChangesMade = true);

  }



  ngAfterViewInit(): void {
    this.initMap();
  }

  geolocate() {
    map.findAccuratePosition();
  }

  // TODO: find a way to properly close suggestion
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

  changesMade() {
    return this.basicChangesMade || this.addressChangesMade;
  }


  onValidate() {
    if (this.basicChangesMade)
      this.ps.updateProfileInfo(
        this.firstName.value,
        this.lastName.value,
        this.email.value,
        this.phoneNumber.value
      ).subscribe((res) => {
        this.changesMadeEvent.emit();
      });
    if (this.addressChangesMade)
      this.ps.updateLocation(
        this.locationOut.lat,
        this.locationOut.lng,
        this.locationOut.formattedAddress,
        (this.location) ? true : false
      ).subscribe((res) => {
        this.changesMadeEvent.emit();
      });
    // if (this.basicChangesMade || this.addressChangesMade)
    //   this.modalClosedEvent.emit();
  }
}

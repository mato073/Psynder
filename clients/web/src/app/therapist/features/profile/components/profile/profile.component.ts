import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ProfileService } from '../../services/profile.service';
import { TherapistResponse, Therapist } from '../../interfaces/therapist';
import { LocationResponse, LocationResponseObject, Location } from '../../interfaces/location';
import { AuthService } from 'src/app/auth/services/auth.service';


@Component({
  selector: 'therapist-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('address_search') public addressSearchRef: ElementRef;


  therapist: Therapist = null;
  location: Location = null;

  basicInfoEditTriggered: boolean = false;
  therapistLoaded: boolean = false;
  locationLoaded: boolean = false;


  constructor(
    private tabTitle: Title,
    private ps: ProfileService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router
  ) {
    this.tabTitle.setTitle("Psynder | Profil");
  }

  getProfileInfo() {
    this.basicInfoEditTriggered = false;
    this.therapistLoaded = false;
    this.locationLoaded = false;
    this.ps.getProfileInfo().pipe(
      map((res: TherapistResponse) => res.therapist))
      .subscribe(
        (therapist: Therapist) => {
          this.therapist = therapist;
          this.therapistLoaded = true;
          this.cdr.detectChanges();
        },
        (err) => console.error(err));
    this.ps.getLocation().pipe(
      map((res: LocationResponse) => res.location))
      .subscribe((location: LocationResponseObject) => {
        this.location = {
          _id: location._id,
          lat : parseFloat(location.lat.$numberDecimal),
          lng: parseFloat(location.lng.$numberDecimal),
          formattedAddress: location.formattedAddress
        };
        this.locationLoaded = true;
      },
      (err) => {
        this.locationLoaded = true;
        console.error(err)
      });
  }

  ngOnInit() {
    this.getProfileInfo();
  }

  deleteAccount() {
    this.ps.deleteUser().subscribe((_) => {
      this.auth.logout();
      this.router.navigateByUrl("/auth/therapist/login");
    },
    (err) => console.log(err));
  }
}

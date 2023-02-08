import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { map } from 'rxjs/operators';

import { ProfileService } from '../../services/profile.service';
import { UserResponse, User , LocationResponse, LocationResponseObject, Location} from '../../interfaces/user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';



@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  @ViewChild('address_search') public addressSearchRef: ElementRef;

  user: User = null;
  location: Location = null;

  basicInfoEditTriggered: boolean = false;
  miniModalTriggered: boolean = false

  constructor(
    private tabTitle: Title,
    private ps: ProfileService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.tabTitle.setTitle("Psynder | Profil");
   }

  getProfileInfo(){
    this.basicInfoEditTriggered = false;
    this.ps.getProfileInfo().pipe(
      map((res: UserResponse) => res.user))
      .subscribe(
        (user: User) => {
          this.user = user;
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
        this.cdr.detectChanges();
      },
      (err) => console.error(err));
  }

  ngOnInit() {
    this.getProfileInfo();
  }

  deleteAccount() {
    this.ps.deleteUser().subscribe((_) => {
      this.auth.logout();
      this.router.navigateByUrl("/auth/login");
    },
    (err) => console.log(err));
  }
}


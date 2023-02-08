import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TherapistsService } from '../../services/therapists.service';
import { Therapist } from '../../../../../shared/models/therapist.model';
import { MapUtilsService } from '../../services/map-utils.service';
import { MapsAPILoader } from '@agm/core';

declare const google: any;

@Component({
  selector: 'app-therapist-details-container',
  templateUrl: './therapist-details-container.component.html',
  styleUrls: ['./therapist-details-container.component.scss']
})
export class TherapistDetailsContainerComponent implements OnInit {
  therapist: Therapist;
  address: string = '';
  scoreBarStyle: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private mal: MapsAPILoader,
    private ts: TherapistsService,
    private mus: MapUtilsService
  ) { 
    let name = this.route.snapshot.paramMap.get('name');
    this.therapist = this.ts.getTherapistByName(name);
  }
  
  ngOnInit() {
    let scoreColor = this.mus.getColorFromPercentage(this.therapist.score/100);
    this.scoreBarStyle = 'background-color:' + scoreColor + ';'; 
    this.scoreBarStyle += 'width:' + this.therapist.score + '%';
    this.mal.load().then(() => {
      let geocoder = new google.maps.Geocoder;
      let latlng = {lat: this.therapist.location.latitude, lng: this.therapist.location.longitude};
      let that = this;
      geocoder.geocode({'location': latlng}, function(results) {
          if (results[0]) {
            let address = results[0].address_components;
            that.address = address[1].short_name + ' ' + address[0].short_name + ', ' + address[6].short_name + ' ' + address[2].short_name;
            that.cdr.detectChanges();
          } else {
            console.log('No results found');
          }
      });
    });
  }

  // TODO: call it when echap pressed also
  // TODO: highlight therapist selected
  switchBackToMap() {
    this.router.navigate(['user/feed/map']);
    return;
  }
}

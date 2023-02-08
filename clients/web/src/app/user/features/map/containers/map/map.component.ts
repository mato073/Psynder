import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { AgmMap } from '@agm/core';
import { TherapistMapIconComponent } from '../../components/therapist-map-icon/therapist-map-icon.component';
import { GeoLocationService } from '../../services/geo-location.service';
import { MapUtilsService } from '../../services/map-utils.service';
import { TherapistsService } from '../../services/therapists.service';
import { Therapist } from '../../../../../shared/models/therapist.model';



declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild(AgmMap) agmMap: AgmMap;
//   @ViewChildren(TherapistMapIconComponent) therapistMapIcons: QueryList<TherapistMapIconComponent>;

  map: any;
  mapType: string = 'roadmap';
  zoom: number = 10;
  centerCoords: {latitude: number, longitude: number};
  specialtyDescription: string;
  therapists: Therapist[];

  constructor(
    public ts: TherapistsService,
    public mus: MapUtilsService,
    public gls: GeoLocationService,
    private cdr: ChangeDetectorRef
    ) {
      this.specialtyDescription = '';

    }
    
    ngOnInit() {
      /* fetching therapists for user */
      this.ts.observableTherapists.subscribe(
      (res: Therapist[]) => {
        this.therapists = res;
      });
    }
    
    ngAfterViewInit() {
      this.mapInit();
      this.agmMap.triggerResize();
    }
    

    mapInit() {
      this.gls.getPosition().subscribe(pos => {
        this.mus.setMapCenterCoords(this.gls.coordinates);
        this.ts.getTherapists(this.gls.coordinates.latitude, this.gls.coordinates.longitude);
        this.cdr.detectChanges();
      });
  }

  mapReady(map: any) {
    this.map = map;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('specialty-helper'));
    // this.gls.updateFormattedAddress();
    this.cdr.detectChanges();
  }

  toggleSpecialtyDescription(e: string) {
    this.specialtyDescription = e;
  }
}

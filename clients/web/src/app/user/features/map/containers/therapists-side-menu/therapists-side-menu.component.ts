import { Component, OnInit } from '@angular/core';
import { TherapistsService } from '../../services/therapists.service';
import { MapUtilsService } from '../../services/map-utils.service';

@Component({
  selector: 'app-therapists-side-menu',
  templateUrl: './therapists-side-menu.component.html',
  styleUrls: ['./therapists-side-menu.component.scss']
})
export class TherapistsSideMenuComponent {

  constructor(
    public ts: TherapistsService,
    private mus: MapUtilsService
  ) { }


  changeMaxDistance(value: number) {
    this.mus.updateMaxDistance(value);
  }
}

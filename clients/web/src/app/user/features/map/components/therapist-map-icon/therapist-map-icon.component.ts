import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MapUtilsService } from '../../services/map-utils.service';
import { Therapist } from '../../../../../shared/models/therapist.model';

@Component({
  selector: 'app-therapist-map-icon',
  templateUrl: './therapist-map-icon.component.html',
  styleUrls: ['./therapist-map-icon.component.scss']
})

export class TherapistMapIconComponent {
  
  @Input() mapCenterCoords: {latitude: number, longitude: number};
  @Input() therapist : Therapist;
  @Output() specialtyDescription = new EventEmitter<string>();

  constructor(
    private router: Router,
    private mus: MapUtilsService,
  ) {}


  switchToTherapistDetails() {
    // TODO: replace by id
			this.router.navigate(['user/feed/details', this.therapist.name]);
			return;
  }
  
  toggleSpecialtyDescription(shown: boolean) {
    // if (shown)
    //   this.specialtyDescription.emit(this.therapist.specialty.description);
    // else
    this.specialtyDescription.emit('');
  }

  isShown() {
    return this.therapist.distance <= this.mus.maxDistance / 1000;
  }
}

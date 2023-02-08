import { Component, OnChanges, Input } from '@angular/core';
import { TherapistsService } from '../../services/therapists.service';
import { MapUtilsService } from '../../services/map-utils.service';

@Component({
  selector: 'app-progress-ring',
  templateUrl: './progress-ring.component.html',
  styleUrls: ['./progress-ring.component.scss']
})
export class ProgressRingComponent implements OnChanges {
  
  /* must be from 0 to 100 */
  @Input() progress: number;
  @Input() avatar: string;
  @Input() initials: string;

  progressColor: string;
  strokeWidth: number;
  radius: number;
  normalizedRadius: number;
  circumference: number;
  strokeDashOffset: number;
  circleFillProperty : string;

  constructor(
      private ts: TherapistsService,
      private mus: MapUtilsService
  ) { 
    this.strokeWidth = 10;
    this.radius = 60;

    this.normalizedRadius = 0;
    this.circumference = 0;
    this.strokeDashOffset = 0;
    this.circleFillProperty = "url(#" + this.avatar + ")"
  
  }

  ngOnChanges() {
    this.normalizedRadius = this.radius - this.strokeWidth * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
    this.strokeDashOffset = this.circumference - this.progress / 100 * this.circumference;
    this.progressColor = this.mus.getColorFromPercentage(this.progress/100); // this.getColorForPercentage(this.progress/100);
  }
}

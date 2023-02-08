import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import  { Therapist } from '../../../../../shared/models/therapist.model';
import { MapUtilsService } from '../../services/map-utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-therapist-menu-card',
  templateUrl: './therapist-menu-card.component.html',
  styleUrls: ['./therapist-menu-card.component.scss']
})
export class TherapistMenuCardComponent implements OnInit {
  @Input() therapist: Therapist;
  scoreBarStyle: string;
  scoreBarWidth: string;

  constructor(
    public mus: MapUtilsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  
  ngOnInit() {
    let scoreColor = this.mus.getColorFromPercentage(this.therapist.score/100);
    this.scoreBarStyle = 'background-color: ' + scoreColor; 

    let width = Math.round(this.therapist.score * 48 / 100)
    this.scoreBarWidth = 'w-' + (width - (width % 8) + 8);

  }

  switchToTherapistDetails() {
    // TODO: replace name by id
    this.router.navigate(['user/feed/details/', this.therapist.name]);
    return;
  }

  isShown() {
    return this.therapist.distance <= this.mus.maxDistance / 1000;
  }
}

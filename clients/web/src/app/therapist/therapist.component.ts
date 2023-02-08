import { Component } from '@angular/core';
import { HeaderSection } from '../shared/interfaces/header-section';

@Component({
  selector: 'app-therapist',
  templateUrl: './therapist.component.html',
  styleUrls: ['./therapist.component.scss']
})
export class TherapistComponent {

  headerSections: HeaderSection[];

  constructor() {
    this.headerSections = [
      {
        title: 'Accueil',
        absoluteRoute: '/therapist/home'
      },
      {
        title: 'Agenda',
        absoluteRoute: '/therapist/agenda'
      },
      {
        title: 'Profil',
        absoluteRoute: '/therapist/profile'
      },
    ]
   }

}

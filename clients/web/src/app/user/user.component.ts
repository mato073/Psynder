import { Component } from '@angular/core';
import { HeaderSection } from '../shared/interfaces/header-section';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  headerSections: HeaderSection[];

  constructor() {
    this.headerSections = [
      {
        title: 'Trouver un thérapeute',
        absoluteRoute: '/user/feed/map'
      },
      {
        title: 'Mon profil',
        absoluteRoute: '/user/profile'
      },
    ]
  }
}

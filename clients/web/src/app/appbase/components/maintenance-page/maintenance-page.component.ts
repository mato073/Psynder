import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-maintenance-page',
  templateUrl: './maintenance-page.component.html',
  styleUrls: ['./maintenance-page.component.scss']
})
export class MaintenancePageComponent {

  constructor(
    private tabTitle: Title
  ) { 
    this.tabTitle.setTitle('Psynder | Maintenance');
  }
}

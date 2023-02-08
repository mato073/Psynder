import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit {

  constructor(
    private tabTitle: Title
  ) { 
    this.tabTitle.setTitle('Psynder | Carte');
  }

  ngOnInit() {
  }

}

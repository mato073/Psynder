import { Component, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { TherapistsService } from '../../services/therapists.service';

@Component({
  selector: 'app-sort-dropdown-menu',
  templateUrl: './sort-dropdown-menu.component.html',
  styleUrls: ['./sort-dropdown-menu.component.scss']
})
export class SortDropdownMenuComponent {

  currentSortingMethod: string;
  dropdownShown: boolean = false;
  initialSortDone: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private ts: TherapistsService
  ) {
    this.currentSortingMethod = "Pertinence";
  }

  sortByScore() {
    this.ts.sortByHighestScore();
    this.dropdownShown = false;
    this.currentSortingMethod = "Pertinence";
  }

  sortByDistance() {
    this.ts.sortByShortestDistance();
    this.dropdownShown = false;
    this.currentSortingMethod = "Distance";
  }

  sortByPrice() {
    this.ts.sortByLowestPrice();
    this.dropdownShown = false;
    this.currentSortingMethod = "Tarif moyen";
  }
}

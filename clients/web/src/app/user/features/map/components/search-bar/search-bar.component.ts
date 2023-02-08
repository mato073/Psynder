import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TherapistsService } from '../../services/therapists.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  search: FormControl;

  constructor(
    public ts: TherapistsService
  ) { 
    this.search = new FormControl('');
  }

  ngOnInit() {
    this.search.valueChanges.subscribe((val: string) => {
      if (val.length === 0)
        this.ts.reset();
      else
        this.searchForMatch()
    });
  }

  searchForMatch() {
    this.ts.searchForKeyword(this.search.value)
    return false; // prevents page reload
  }

  resetSearch() {
    this.search.setValue('');
    this.ts.reset();
  }
}

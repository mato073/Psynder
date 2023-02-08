import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Availabilities, DayAvailabilities } from '../../interfaces/availabilities';
import { AvailabilitiesService } from '../../services/availabilities.service';

@Component({
  selector: 'app-availabilities',
  templateUrl: './availabilities.component.html',
  styleUrls: ['./availabilities.component.scss']
})
export class AvailabilitiesComponent implements OnInit {

  availabilitiesEditTriggered: boolean = false;
  dayAvailabilitiesModalShown: boolean = false;
  contentLoaded: boolean = false;

  availabilities: Availabilities = null;

  constructor(
    private as: AvailabilitiesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchAvailabilities();
  }

  fetchAvailabilities() {
    this.contentLoaded = false;
    this.as.fetchAvailabilities().subscribe((res: Availabilities) => {
      this.availabilities = res;
      this.contentLoaded = true;
      this.as.refreshAvailabilities(res);
      this.cdr.detectChanges();
    }, err =>  {
      console.error(err);
      this.contentLoaded = true;
    });
  }  

  doAvailabilitiesExist(): boolean {
    if (!this.availabilities || !this.availabilities.days || this.availabilities.days.length === 0)
      return false;
    for (let av of this.availabilities.days)
      if (av.timeSlots && av.timeSlots.length > 0)
        return true;
    return false;
  }
}

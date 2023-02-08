import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Availabilities, DayAvailabilities } from '../../interfaces/availabilities';
import { AvailabilitiesService } from '../../services/availabilities.service';

@Component({
  selector: 'app-day-availabilities-slot',
  templateUrl: './day-availabilities-slot.component.html',
  styleUrls: ['./day-availabilities-slot.component.scss']
})
export class DayAvailabilitiesSlotComponent implements OnInit {

  @Input() day: DayAvailabilities;
  @Input() availabilitiesEditTriggered: boolean;
  @Output() slotUpdateEvent = new EventEmitter();

  DAYS_IN_WEEK: Array<string> = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  DAYS_IN_WEEK_EN: Array<string> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  dayIndex: number;

  dayAvailabilitiesModalShown: boolean = false;

  constructor(
    private as: AvailabilitiesService
  ) { }

  ngOnInit() {
    this.dayIndex = this.DAYS_IN_WEEK_EN.indexOf(this.day.day);
  }

  deleteDay() {
    let avCopy: Availabilities = {...this.as.availabilities};
    let index = avCopy.days.findIndex(e => e.day === this.DAYS_IN_WEEK_EN[this.dayIndex]);
    avCopy.days[index].timeSlots = [];
    this.as.registerNewAvailabilities(avCopy).subscribe((_) => {
      this.slotUpdateEvent.emit();
    }, (err) => console.error(err));
  }
}

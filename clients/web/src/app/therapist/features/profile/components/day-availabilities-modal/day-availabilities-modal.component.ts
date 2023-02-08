import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TimeSlot } from '../../interfaces/timeslot';
import { AvailabilitiesService } from '../../services/availabilities.service';

@Component({
  selector: 'app-day-availabilities-modal',
  templateUrl: './day-availabilities-modal.component.html',
  styleUrls: ['./day-availabilities-modal.component.scss']
})
export class DayAvailabilitiesModalComponent implements OnInit {

  @Output() closeEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter();

  DAYS_IN_WEEK: Array<string> = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  DAYS_IN_WEEK_EN: Array<string> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  chosenDay: number = 0;
  dayPickerShown: boolean = false;

  timeSlotPickerShown: boolean = false;
  timeSlotStartInMin: number;
  timeSlotEndInMin: number;
  timeSlots: Array<TimeSlot> = [];

  @Input() chosenDayIn: number | undefined = undefined;

  constructor(
    private as: AvailabilitiesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.chosenDayIn !== undefined)
      this.timeSlots = JSON.parse(JSON.stringify(this.as.availabilities.days[this.chosenDayIn].timeSlots));
    else if (this.as.availabilities) {
      for (let i = this.DAYS_IN_WEEK_EN.length - 1; i >= 0; i--) {
        let found = this.as.availabilities.days.find(e => e.day === this.DAYS_IN_WEEK_EN[i] && e.timeSlots.length > 0);
        if (found !== undefined) {
          this.DAYS_IN_WEEK.splice(i, 1);
          this.DAYS_IN_WEEK_EN.splice(i, 1);
        }
        this.cdr.detectChanges();
      }
    }
  }

  newDayValue(val: string) {
    this.chosenDay = this.DAYS_IN_WEEK.indexOf(val);
    this.dayPickerShown = false;
  }

  // TODO: prevent timeslot end to be before start date
  setTimeslotStartDate(timeInMin: number) {
    this.timeSlotStartInMin = timeInMin;
  }

  setTimeslotEndDate(timeInMin: number) {
    this.timeSlotEndInMin = timeInMin;
  }

  validateTimeslot() {
    let slotStart: string = (Math.floor(this.timeSlotStartInMin / 60 % 24)).toString() + ':';
    if (this.timeSlotStartInMin % 60 < 10)
      slotStart += '0' + Math.floor(this.timeSlotStartInMin % 60).toString();
    else
      slotStart += Math.floor(this.timeSlotStartInMin % 60).toString();
    
    let slotEnd: string = (Math.floor(this.timeSlotEndInMin / 60 % 24)).toString() + ':';
    if (this.timeSlotEndInMin % 60 < 10)
      slotEnd += '0' + Math.floor(this.timeSlotEndInMin % 60).toString();
    else
      slotEnd += Math.floor(this.timeSlotEndInMin % 60).toString();
   
    if (parseInt(slotStart) < 10)
      slotStart = '0' + slotStart;
    if (parseInt(slotEnd) < 10)
      slotEnd = '0' + slotEnd;
   
    this.timeSlots.push({
      from: slotStart,
      to: slotEnd,
      type: 'AnyAppointments',
      color: '#FFFFFF'
    });
    this.timeSlotPickerShown = false;
  }

  deleteTimeSlot(slot) {
    const index = this.timeSlots.indexOf(slot);
    this.timeSlots.splice(index, 1);
  }

  registerDayTimeslots() {
    this.as.registerNewAvailabilitiesForOneDay(this.DAYS_IN_WEEK_EN[this.chosenDay], this.timeSlots).subscribe((res) => {
      this.updateEvent.emit();
      this.closeEvent.emit();
    }, (err) => {
      console.log(err);
    });
  }
}

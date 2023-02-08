import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Duration } from 'date-fns';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {

  POSSIBLE_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  POSSIBLE_MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  @Output() timeInMin = new EventEmitter<number>();

  @Input() hour: number | null = null;
  @Input() min: number | null = null;

  showHours: boolean = false;
  hoursValue: number;

  showMinutes: boolean = false;
  minutesValue: string;

  private emitNewValue() {
    this.timeInMin.emit(
      this.hoursValue * 60 + parseInt(this.minutesValue)
    );
  }

  constructor() { 
  }
  
  ngOnInit() {
    this.hoursValue = (this.hour) ? this.hour : 0;
    this.minutesValue = (this.min !== null) ? this.min.toString() : '30';
    this.emitNewValue();
  }

  newHourValue(val) {
    this.hoursValue = val;
    this.showHours = false;
    this.emitNewValue();
  }

  newMinutesValue(val) {
    this.minutesValue = val;
    this.showMinutes = false;
    this.emitNewValue();
  }
}

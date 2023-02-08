import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
  DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];


  @Output() date = new EventEmitter<Date>();

  @Input() dateIn: Date;

  @ViewChild('date') dateRef;

  showDatePicker: boolean = false;
  datePickerValue: string;

  month: number;
  year: number;
  no_of_days: Array<any> = [];
  blankdays: Array<any> = [];
  days: Array<string> = this.DAYS;


  private emitDatePickerValue() {
    this.date.emit(new Date(this.datePickerValue.split('/').reverse().join('/')));
  }

  constructor() { }

  ngOnInit() {
    this.initDate();
    this.emitDatePickerValue();
    this.getNoOfDays();
  }


  initDate() {
    let today = new Date();
    if (this.dateIn) {
      this.month = this.dateIn.getMonth();
      this.year = this.dateIn.getFullYear();
      this.datePickerValue = new Date(this.dateIn.getTime()).toLocaleDateString('fr-FR');
      return;
    }
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.datePickerValue = new Date(this.year, this.month, today.getDate()).toLocaleDateString('fr-FR');
  }

  isToday(date) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString() ? true : false;
  }
  
  isDatePickerValue(date) {
    return date == this.datePickerValue.split('/')[0];
  }

  getDateValue(date) {
      let selectedDate = new Date(this.year, this.month, date);
      this.datePickerValue = selectedDate.toLocaleDateString('fr-FR');
      this.emitDatePickerValue();
      this.dateRef.value = selectedDate.getFullYear() +"-"+ ('0'+ selectedDate.getMonth()).slice(-2) +"-"+ ('0' + selectedDate.getDate()).slice(-2);
      this.showDatePicker = false;
  }

  getNoOfDays() {
      let daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
      // find where to start calendar day of week
      let dayOfWeek = new Date(this.year, this.month).getDay();
      let blankdaysArray = [];
      for ( var i=1; i <= dayOfWeek; i++) {
          blankdaysArray.push(i);
      }
      let daysArray = [];
      for ( var i=1; i <= daysInMonth; i++) {
          daysArray.push(i);
      }
      this.blankdays = blankdaysArray;
      this.no_of_days = daysArray;
  }

  getPreviousMonth() {
    this.month--;
    this.getNoOfDays();
  }

  getNextMonth() {
    this.month++;
    this.getNoOfDays();
  }

}

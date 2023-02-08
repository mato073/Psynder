import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';

import { AppointmentService } from '../../../../therapist-shared/services/appointment.service';
import { AppointmentsResponse, Appointment } from '../../../../therapist-shared/interfaces/appointment';


@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {

  @Input() isPast: boolean;

  startDate: Date;
  endDate: Date;

  apts: Array<Appointment>;

  updateAppointmentModalTriggered: boolean = false;
  aptToUpdate: Appointment;

  constructor(
    private cdr: ChangeDetectorRef,
    private as: AppointmentService,
  ) { }

  ngOnInit() {
    if (this.isPast)
      this.setPastTimeframe();
    else
      this.setFutureTimeframe();
    this.getAppointmentsForTimeframe();
  }

  setPastTimeframe() {
    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
  }

  setFutureTimeframe() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.endDate.setDate(this.endDate.getDate() + 7);
  }

  getAppointmentsForTimeframe() {
    const sortAscending = this.isPast ? true : false;
    const sortDescending = this.isPast ? false : true;
    this.as.getAppointmentsWithinTimeframe(this.startDate, this.endDate, sortAscending, sortDescending).pipe(
      map(
        (res: AppointmentsResponse) => res.appointments
      )).subscribe( (apts: Array<Appointment>) => {
      this.apts = [];
      for (let apt of apts) {
        let endDate = new Date(apt.date);
        endDate.setMinutes(endDate.getMinutes() + apt.durationInMin);
        this.apts.push(apt);
        this.cdr.detectChanges();
      }
    }, (err) => console.log(err));
  }

  getAptEndDate(date: string, duration: number) : string {
    let d = new Date(date);
    d.setMinutes(d.getMinutes() + duration);
    return d.toISOString();
  }

  getElapsedTime(aptDate: string): string {
    const actualDate = new Date(aptDate).getTime();
    const now = new Date().getTime();
    const diffInMins = Math.abs(now - actualDate) / 60000;   
    const mins = Math.floor(diffInMins % 60);
    const hours = Math.floor(diffInMins / 60 % 24);
    const days = Math.floor(diffInMins / (60 * 24));
    return ((days !== 0) ? days + 'j' : '') + ' ' + 
      ((hours !== 0) ? hours + 'h' : '') + ' ' +
      ((mins !== 0 && (days === 0 || hours === 0)) ? mins + 'min' : '');
  }

  triggerAptUpdateModal(apt: Appointment) {
    this.aptToUpdate = apt;
    this.updateAppointmentModalTriggered = true;
  }
}

import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../interfaces/appointment';
import { User } from '../../interfaces/user';


@Component({
  selector: 'app-update-appointment-modal',
  templateUrl: './update-appointment-modal.component.html',
  styleUrls: ['./update-appointment-modal.component.scss']
})
export class UpdateAppointmentModalComponent implements OnInit {
  math = Math;

  @Output() modalClosedEvent = new EventEmitter<any>();
  @Output() dateUpdated = new EventEmitter<any>();
  
  @Input() apt: Appointment = null;
  user: User = null;
  date: Date;
  endDate: Date;

  tmpDate: Date;
  tmpDuration: number;

  updateViewTriggered: boolean = false;
  validateClicked: boolean = false;
  deleteClicked: boolean = false;


  constructor(
    private cdr: ChangeDetectorRef,
    private as: AppointmentService,
  ) {}

  ngOnInit() {
    this.user = this.apt.user;
    this.date = new Date(this.apt.date);
    this.endDate = new Date(this.apt.date);
    this.endDate.setMinutes(this.endDate.getMinutes() + this.apt.durationInMin);
    this.tmpDate = new Date(this.date);
    this.tmpDuration = this.apt.durationInMin;
  }

  setNewDate(date) {
    date.setHours(this.tmpDate.getHours());
    date.setMinutes(this.tmpDate.getMinutes());
    this.tmpDate = new Date(date);
  }

  setNewDateTime(timeInMin) {
    this.tmpDate.setHours(Math.floor(timeInMin / 60));
    this.tmpDate.setMinutes(timeInMin % 60);
    this.cdr.detectChanges();
  }

  setNewDuration(timeInMin) {
    this.tmpDuration = timeInMin;
  }

  onDelete() {
    this.deleteClicked = true;
    this.as.deleteAppointment(this.apt._id).subscribe((_) => {
      this.dateUpdated.emit();
      this.modalClosedEvent.emit();
    }, (err) => {
      console.error(err);
      this.deleteClicked = false;
    });
  }

  onUpdate() {
    this.validateClicked = true;
    this.as.updateAppointment(this.apt._id, this.tmpDate, this.tmpDuration).subscribe((_) => {
      this.dateUpdated.emit();
      this.modalClosedEvent.emit();
    }, (err) => {
      console.error(err);
      this.validateClicked = false;
    }
    );
  }
}

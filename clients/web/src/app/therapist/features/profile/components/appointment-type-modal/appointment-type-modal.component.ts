import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { AppointmentType } from 'src/app/therapist/therapist-shared/interfaces/appointment-type';

@Component({
  selector: 'app-appointment-type-modal',
  templateUrl: './appointment-type-modal.component.html',
  styleUrls: ['./appointment-type-modal.component.scss']
})
export class AppointmentTypeModalComponent implements OnInit {

  @Output() modalClosedEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter();
  @Input() iAptType : AppointmentType | null = null;

  title: FormControl;
  duration: number = 60;
  color: string = "#FBEA9D";
  description: FormControl;

  math = Math;

  constructor(
    private ps: ProfileService
  ) { 
    this.title = new FormControl();
    this.description = new FormControl();
  }

  ngOnInit() {
    if (this.iAptType) {
      this.title = new FormControl(this.iAptType.name);
      let durationChunks = this.iAptType.duration.split(':');
      this.duration = parseInt(durationChunks[0], 10) * 60;
      this.duration += parseInt(durationChunks[1], 10);
      this.color = this.iAptType.color;
      this.description = new FormControl(this.iAptType.description);
    }
  }

  setDuration(timeInMin: number) {
    this.duration = timeInMin;
  }

  private _durationToFormat() {
    let res: string = (Math.floor(this.duration / 60 % 24)).toString() + ':';
    if (this.duration % 60 < 10)
      res += '0' + Math.floor(this.duration % 60).toString();
    else
      res += Math.floor(this.duration % 60).toString();
    
    if (parseInt(res) < 10)
      res = '0' + res;

    return res;
  }

  registerType() {
    let oDuration = this._durationToFormat();
    if (!this.iAptType)
      this.ps.addAppointmentType(
        this.title.value,
        oDuration,
        this.color,
        this.description.value
      ).subscribe((_) => {
        this.updateEvent.emit();
        this.modalClosedEvent.emit();
      },
      (err) => console.error(err));
    else
      this.ps.updateAppointmentType(
        this.iAptType._id,
        this.title.value,
        oDuration,
        this.color,
        this.description.value
      ).subscribe((_) => {
        this.updateEvent.emit();
        this.modalClosedEvent.emit();
      }, (err) => console.error(err));
  }

}

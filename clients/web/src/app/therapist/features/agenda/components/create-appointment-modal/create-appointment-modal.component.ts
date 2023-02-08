import { 
  Component, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef,
  HostListener,
} from '@angular/core';
import { User } from '../../../../therapist-shared/interfaces/user';
// import { Duration } from 'date-fns';
import { AppointmentService } from '../../../../therapist-shared/services/appointment.service';


@Component({
  selector: 'app-create-appointment-modal',
  templateUrl: './create-appointment-modal.component.html',
  styleUrls: ['./create-appointment-modal.component.scss']
})
export class CreateAppointmentModalComponent  {

  @Output() modalClosedEvent = new EventEmitter<any>();
  @Output() appointmentCreated = new EventEmitter<any>();

  date: Date = null;
  time: number = null;
  duration: number = null;
  user: User = null;

  
  constructor(
    private as: AppointmentService
  ) {}
  
  
  setDate(val: Date) { 
    this.date = val; 
  }

  setTime(val: number) { 
    this.time = val; 
  }

  setDuration(val: number) { 
    this.duration = val; 
  }

  setUser(val: User) { 
    this.user = val; 
  }


  onValidate() {
    this.date.setHours(Math.floor(this.time / 60));
    this.date.setMinutes(this.time % 60);
    this.as.createAppointment( this.user._id, this.date, this.duration).subscribe((_) => {
      this.appointmentCreated.emit();
      this.modalClosedEvent.emit();
    });
  }
}

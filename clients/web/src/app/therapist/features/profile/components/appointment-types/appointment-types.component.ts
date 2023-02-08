import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AppointmentType } from '../../../../therapist-shared/interfaces/appointment-type';

@Component({
  selector: 'app-appointment-types',
  templateUrl: './appointment-types.component.html',
  styleUrls: ['./appointment-types.component.scss']
})
export class AppointmentTypesComponent implements OnInit {

  // TODO: help hover btn to indicate what each section does

  editTriggered: boolean = false;
  modalShown: boolean = false;
  aptTypes: Array<AppointmentType>;
  tmpAptType: AppointmentType | null = null;

  contentLoaded: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private ps: ProfileService
  ) { }

  fetchAppointmentTypes() {
    this.contentLoaded = false;
    this.ps.getAppointmentTypes().subscribe((res: Array<AppointmentType>) => {
      this.cdr.detectChanges();
      this.aptTypes = res;
      this.contentLoaded = true;
    }, (err) => {
      console.error(err);
      this.contentLoaded = true;
    });
  }

  ngOnInit() {
    this.fetchAppointmentTypes();
  }

  showUpdateModal(aptType) {
    this.tmpAptType = aptType;
    this.modalShown = true;
  }

  onModalClosed() {
    this.tmpAptType = null;
    this.modalShown = false;
  }

  deleteAptType(aptType: AppointmentType) {
    this.ps.deleteAppointmentType(aptType._id).subscribe((_) => {
      this.fetchAppointmentTypes();
    }, (err) => console.error(err));
  }
}

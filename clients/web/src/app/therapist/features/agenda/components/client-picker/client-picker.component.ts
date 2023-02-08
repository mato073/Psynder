import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppointmentService } from '../../../../therapist-shared/services/appointment.service';
import { ClientsResponse, User } from '../../../../therapist-shared/interfaces/user';

@Component({
  selector: 'app-client-picker',
  templateUrl: './client-picker.component.html',
  styleUrls: ['./client-picker.component.scss']
})
export class ClientPickerComponent implements OnInit {

  users: Array<User>;
  shownUser: FormControl = new FormControl('');
  showUsers: boolean;
  userSelected: boolean;
  @Output() userOut = new EventEmitter<User>(null);

  constructor(
    private as: AppointmentService
  ) { }

  ngOnInit() {
    this.getClients();
    this.shownUser.valueChanges.subscribe((_) => {
      this.getClients();
    })
  }

  getClients() {
    this.as.fetchLastClients(this.shownUser.value).subscribe((res: ClientsResponse) => {
      console.log("RES: ", res);
      this.users = JSON.parse(res.clients);
    });
  }

  selectUser(selected: User) {
    this.userOut.emit(selected);
    this.showUsers = false;
    this.shownUser.setValue(selected.firstName + ' ' + selected.lastName);
  }
  
}

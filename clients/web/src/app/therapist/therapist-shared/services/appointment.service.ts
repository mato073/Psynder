import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Appointment } from '../interfaces/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseUrl = environment.backendUrl;

  public currentWeekAppointments: Array<Appointment>; 

  constructor(
    private http: HttpClient
  ) { }

  public setCurrentWeekAppointments(apts: Array<Appointment>) {
    this.currentWeekAppointments = apts;
  }

  getAppointmentsWithinTimeframe(startDate: Date, endDate: Date, 
    sortAscending: boolean = false, sortDescending: boolean = false) {
    const url = `${this.baseUrl}/therapists/current/appointments`;
    let sort: string = undefined;
    if (sortAscending)
      sort = 'ascending';
    else if (sortDescending)
      sort = 'descending';
    let params = new HttpParams({
      fromObject: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        sort: sort
      }
    });
    return this.http.get(url, {params: params});
  }


  deleteAppointment(appointmentId: string) {
    const url = `${this.baseUrl}/appointments/${appointmentId}`;
    return this.http.delete(url);
  }

  updateAppointment(appointmentId: string, date: Date, duration: number) {
    const url = `${this.baseUrl}/appointments/${appointmentId}`;
    return this.http.patch(url, {
      date: (date) ? date.toISOString() : undefined,
      duration: (duration) ? duration : undefined
    })
  }

  fetchLastClients(search: string = '') {
    const url = `${this.baseUrl}/therapists/current/clients`;
    let params = new HttpParams({
        fromObject: {
          search: search.length > 0 ? search : undefined
        }
    });
    return this.http.get(url, { params: search.length > 0 ? params : null });
  }

  createAppointment(userId: string, date: Date, duration: number) {
    const url = `${this.baseUrl}/appointments/`;
    let uid = localStorage.getItem('uid');
    return this.http.post(url, {
      user: userId,
      therapist: uid,
      date: date.toISOString(),
      duration: duration
    });
  }

}

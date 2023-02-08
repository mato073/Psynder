import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TimeSlot } from '../interfaces/timeslot';
import { Availabilities, DayAvailabilities } from '../interfaces/availabilities';

@Injectable({
  providedIn: 'root'
})
export class AvailabilitiesService {

  baseUrl = environment.backendUrl;
  availabilities: Availabilities = null;

  constructor(
    private http: HttpClient
  ) { }

  refreshAvailabilities(newAvailabilities: Availabilities) {
    this.availabilities = newAvailabilities;
  }

  registerNewAvailabilitiesForOneDay(day: string, timeSlots: Array<TimeSlot>) {
    const url = `${this.baseUrl}/availabilities`;
    if (!this.availabilities)
      return this.http.post(url, {
        days: [
          {
            day: day,
            timeSlots: timeSlots 
          }
        ]
      });
    return this.http.patch(url, {
      days: [
        {
          day: day,
          timeSlots: timeSlots 
        }
      ]
    });
  }

  registerNewAvailabilities(av: Availabilities) {
    const url = `${this.baseUrl}/availabilities`;
    if (!this.availabilities)
      return this.http.post(url, av);
    return this.http.patch(url, av);
  }

  fetchAvailabilities() {
    const url = `${this.baseUrl}/availabilities`;
    return this.http.get(url);
  }
}

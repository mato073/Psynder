import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = environment.backendUrl;

  constructor(
    private http: HttpClient
  ) {}

  getProfileInfo() {
    const url = `${this.baseUrl}/therapists/current`;
    return this.http.get(url);
  }

  getLocation() {
    const url = `${this.baseUrl}/therapists/current/location`;
    return this.http.get(url);
  }

  /* update */
  updateProfileInfo(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
  ) {
    const url = `${this.baseUrl}/therapists/current`;
    return this.http.patch(url, {
      firstName: firstName ? firstName : null,
      lastName: lastName ? lastName : null,
      email: email ? email : null,
      phoneNumber: phoneNumber ? phoneNumber : null,
    });
  }


  updateLocation(lat: number, lng: number, formattedAddress: string, didLocationExist: boolean = false) {
    const url = `${this.baseUrl}/therapists/current/location`;
    if (didLocationExist)
      return this.http.patch(url, {
        lat: lat.toString(),
        lng: lng.toString(),
        formattedAddress: formattedAddress
      });
    return this.http.post(url, {
      lat: lat.toString(),
      lng: lng.toString(),
      formattedAddress: formattedAddress
    });
  }

  updateDescription(description: string) {
    const url = `${this.baseUrl}/therapists/current`;
    return this.http.patch(url, {
      description: description
    })
  }

  getAppointmentTypes() {
    const url = `${this.baseUrl}/therapists/current/appointmentTypes`;
    return this.http.get(url);
  }

  addAppointmentType(
    name: string,
    duration: string,
    color: string,
    description: string
  ) {
    const url = `${this.baseUrl}/therapists/current/appointmentType`;
    return this.http.post(url, {
      name: name,
      duration: duration,
      color: color,
      description: description
    });
  }

  updateAppointmentType(
    id: string,
    name: string,
    duration: string,
    color: string,
    description: string
  ) {
    const url = `${this.baseUrl}/therapists/current/appointmentType/${id}`;
    return this.http.patch(url, {
      name: name,
      duration: duration,
      color: color,
      description: description
    });
  }

  deleteAppointmentType(id: string) {
    const url = `${this.baseUrl}/therapists/current/appointmentType/${id}`;
    return this.http.delete(url);
  }

  deleteUser(isTherapist: boolean = true) {
		const url = isTherapist ? `${this.baseUrl}/therapists/current` : `${this.baseUrl}/users/current`;
		return this.http.delete(url);
  }

  updateTags(tags: Array<string>) {
      const url = `${this.baseUrl}/therapists/current`;
      return this.http.patch(url, {
        tags: tags ? tags : null,
      });
    }
}

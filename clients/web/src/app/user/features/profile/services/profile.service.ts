import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { QuestionaireService } from '../../questionaire/services/questionaire.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl = environment.backendUrl;


constructor(
  private http: HttpClient,
  private qs: QuestionaireService,
  ) {}

  getProfileInfo() {
    const url = `${this.baseUrl}/users/current`;
    return this.http.get(url);
  }

  getLocation() {
    const url = `${this.baseUrl}/users/current/location`;
    return this.http.get(url);
  }

  updateExoInfo( text: string) {
    this.qs.setData(text, "exerciseText");
    return;
  }

  updateProfileInfo(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
  ) {
    const url = `${this.baseUrl}/users/current`;
    return this.http.patch(url, {
      firstName: firstName ? firstName : null,
      lastName: lastName ? lastName : null,
      email: email ? email : null,
      phoneNumber: phoneNumber ? phoneNumber : null,
    });
  }

  updateLocation(lat: number, lng: number, formattedAddress: string, didLocationExist: boolean = false) {
    const url = `${this.baseUrl}/users/current/location`;
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

  deleteUser(isTherapist: boolean = false) {
		const url = isTherapist ? `${this.baseUrl}/therapists/current` : `${this.baseUrl}/users/current`;
		return this.http.delete(url);
  }

}

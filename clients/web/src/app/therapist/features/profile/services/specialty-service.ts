import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Specialty, ListExistingSpecialtiesResponse, CreateSpecialtyResponse } from '../interfaces/specialty';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  baseUrl = environment.backendUrl;
  existingSpecialties: Array<Specialty> = []

  constructor(
    private http: HttpClient
  ) {
  }
  
  private getSpecialtyIfItExists(specialtyName: string): any {
    for (let i = 0; i < this.existingSpecialties.length; ++i) {
      if (this.existingSpecialties[i].name === specialtyName)
        return this.existingSpecialties[i];
    }
    return null;
  }

  private createNewSpecialty(specialtyName: string) {
    const url = `${this.baseUrl}/specialties`;
    return this.http.post(url, {
      name: specialtyName
    });
  }


  getExistingSpecialties() {
    this.http.get(`${this.baseUrl}/specialties`).subscribe(
      (res: ListExistingSpecialtiesResponse) => this.existingSpecialties = res.specialties,
      (err) => console.log(err)
    );  
  }

  async addSpecialtyToTherapist(specialtyName: string) {
    let existingSpecialty = this.getSpecialtyIfItExists(specialtyName);
    var specialtyId = existingSpecialty?._id;
    if (!existingSpecialty)
      specialtyId = await this.createNewSpecialty(specialtyName).toPromise().then(
        (res: CreateSpecialtyResponse) => res.specialtyId
      );
    const url = `${this.baseUrl}/therapists/current/specialties`
    return this.http.post(url, {
      specialty: specialtyId
    }).toPromise();
  }

  removeSpecialtyForTherapist(specialtyId: string) {
    const url = `${this.baseUrl}/therapists/current/specialties`;
    let params = new HttpParams({
      fromObject: {
        'specialty': specialtyId
      }
    });
    return this.http.delete(url, { params: params });
    // return this.http.request('delete', url, {
    //   body: {
    //     specialty: specialtyId
    //   }
    // });
  }
}

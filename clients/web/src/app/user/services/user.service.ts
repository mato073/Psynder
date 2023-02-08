import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { QuestionaireService } from '../features/questionaire/services/questionaire.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.backendUrl;

  constructor(
	  private http: HttpClient,
	  private mini: QuestionaireService,
	  ) {}

  getUserInfo(): Promise<Object> {
		const url = `${this.baseUrl}/users/current`;
		return this.http.get(url).toPromise()
		.then(function(res) {
			return res;
		}).catch(function(err) {
			throw err;
		});
	}
}

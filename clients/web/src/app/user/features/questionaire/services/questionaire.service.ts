import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AllCategoryTab, ConditionsObject, 
  AllQuestions, ReturnedQuestions, checkSurveyResponse, allQuestionsJson, Questions,
  ResultSurveyResponse} from '../components/question/question';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class QuestionaireService {

  baseUrl = environment.backendUrl;

  constructor(
   private http: HttpClient,
   private router: Router
  ) { }

  getCategoryNames(): Promise<Object> {
    const url = `${this.baseUrl}/survey/names`;
    return this.http.get<AllCategoryTab>(url).toPromise()
    .then(function(result) {
      return result;
    }).catch(function(err) {
      throw err;
    });
  }
  
  getSurveyByName(name: string): Promise<Object> {
    const url = `${this.baseUrl}/survey/${name}`;
    return this.http.get<AllQuestions>(url).toPromise()
    .then((res: AllQuestions) => {
      return res;
    }).catch(err => {
      throw err;
    })
  }

  checkCondition(questions: Array<ReturnedQuestions>, conditions: Array<ConditionsObject>): Promise<checkSurveyResponse> {
    const url = `${this.baseUrl}/survey/check-conditions`;
    return this.http.post(url, {
      questions,
      conditions
    }).toPromise()
    .then(function(result: checkSurveyResponse) {
        return result;
      }).catch(function(err) {
       throw err;
     });
  }

  
  sendSurveyResult(allQuestions: AllQuestions): Promise<string> {
    var potentialDisorder: string = allQuestions.potentialDisorder;
    var Questions: Array<Questions> = allQuestions.Questions;
    const url = `${this.baseUrl}/survey/users/results`;
    return this.http.post(url, {
      potentialDisorder,
      Questions
    }).toPromise()
    .then(function(result: ResultSurveyResponse) {
        return result.message;
      }).catch(function(err) {
       throw err;
     });
  }

  endRedirection() {
    this.deleteData('questionCategory');
    this.deleteData('allQuestions');
    this.deleteData('categoryIndex');
    this.deleteData('questionIndex');
    this.deleteData('answeredQuestions');
    this.setData(true, 'finishedMini');
    this.router.navigateByUrl("/user/feed");
  }

  setData(data: any, key: string) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    return;
  }

  getData(key: string): any {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
  }

  deleteData(key: string) {
    localStorage.removeItem(key);
    return;
  }
}

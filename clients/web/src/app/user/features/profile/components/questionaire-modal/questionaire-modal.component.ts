import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { QuestionaireService } from '../../../questionaire/services/questionaire.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-questionaire-modal',
  templateUrl: './questionaire-modal.component.html',
  styleUrls: ['./questionaire-modal.component.scss']
})
export class QuestionaireModalComponent implements OnInit {

  @Output() modalClosedEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private cdr: ChangeDetectorRef,
    private ps: ProfileService,
    private qs: QuestionaireService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  goToMini() {
    if(localStorage.getItem('questionCategory'))
      localStorage.removeItem('questionCategory');
    if(localStorage.getItem('allQuestions'))
      localStorage.removeItem('allQuestions');
    if(localStorage.getItem('categoryIndex'))
      localStorage.removeItem('categoryIndex');
    if(localStorage.getItem('questionIndex'))
      localStorage.removeItem('questionIndex');
    if(localStorage.getItem('answeredQuestions'))
      localStorage.removeItem('answeredQuestions');
    if(localStorage.getItem('finishedMini'))
      localStorage.removeItem('finishedMini');
    this.router.navigateByUrl("/user/questionaire/acceuil");
   }

   goToSaveMini() {
    if(localStorage.getItem('finishedMini'))
      localStorage.removeItem('finishedMini');
    this.router.navigateByUrl("/user/questionaire/acceuil");
   }

}

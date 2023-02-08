import { Component, OnInit } from '@angular/core';
import { QuestionaireService } from '../../../questionaire/services/questionaire.service';
import { ExerciseModalComponent } from '../exercise-modal/exercise-modal.component';


export interface TextObject {
  exerciseText: string
}
@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})

export class ExercisesComponent implements OnInit {

  text: TextObject = {} as TextObject;
  therapist: boolean = true;
  exerciceEditTriggered: boolean = false;

  constructor( private qs: QuestionaireService) {
    this.text.exerciseText = 'test'
   }

  ngOnInit() {
    const currentUrl = window.location.href;
    if(!currentUrl.includes('therapist')) {
      //this.therapist = false;
    }
    if (this.qs.getData('exerciseText')){
      this.text.exerciseText = this.qs.getData('exerciseText');
    }
  }

  getExoInfo() {
    this.exerciceEditTriggered = false;
    this.text.exerciseText = this.qs.getData('exerciseText');
  }

}

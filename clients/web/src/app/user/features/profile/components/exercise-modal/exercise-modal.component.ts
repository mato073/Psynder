import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { QuestionaireService } from '../../../questionaire/services/questionaire.service';
import { TextObject } from '../exercises/exercises.component'

@Component({
  selector: 'exercise-modal',
  templateUrl: './exercise-modal.component.html',
  styleUrls: ['./exercise-modal.component.scss']
})
export class ExerciseModalComponent implements OnInit {

  @Input() text: TextObject;
  @Output() modalClosedEvent: EventEmitter<any> = new EventEmitter();
  @Output() changesMadeEvent: EventEmitter<any> = new EventEmitter();

  basicChangesMade: boolean = false;
  exerciseText: FormControl;


  constructor(
    private cdr: ChangeDetectorRef,
    private ps: ProfileService,
    private qs: QuestionaireService,

  ) { }

  ngOnInit() {
    this.exerciseText = new FormControl(this.text.exerciseText);
    this.exerciseText.valueChanges.subscribe((_) => this.basicChangesMade = true);
  }

  onValidate() {
    if (this.basicChangesMade)
    {
      this.qs.deleteData("exerciseText");
      this.qs.setData(this.exerciseText.value, "exerciseText");
      this.changesMadeEvent.emit();
    }
  }

  changesMade() {
    return this.basicChangesMade;
  }

}



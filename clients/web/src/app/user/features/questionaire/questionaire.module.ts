import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionaireComponent } from './container/questionaire/questionaire.component';
import { QuestionaireRoutingModule } from './questionaire-routing.module';
import { QuestionComponent } from './components/question/question.component';
import { AcceuilComponent } from './components/acceuil/acceuil.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule} from '../../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    QuestionaireRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    QuestionaireComponent,
    QuestionComponent,
    AcceuilComponent
  ]
})
export class QuestionaireModule { }

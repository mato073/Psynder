import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionaireComponent } from './container/questionaire/questionaire.component';
import { AcceuilComponent } from './components/acceuil/acceuil.component';
import { QuestionComponent } from './components/question/question.component';



const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'acceuil'
  },
  {
    path: '',
    component: QuestionaireComponent,
    children:[
      {
        path: 'acceuil',
        component: AcceuilComponent
    },
    {
        path: 'question',
        component: QuestionComponent
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionaireRoutingModule {}

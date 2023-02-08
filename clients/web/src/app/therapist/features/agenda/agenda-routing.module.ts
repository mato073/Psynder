import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendaPageComponent } from './containers/agenda-page/agenda-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AgendaPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule {}

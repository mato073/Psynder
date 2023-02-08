import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TherapistComponent } from './therapist.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '',
    component: TherapistComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'agenda',
        loadChildren: () => import('./features/agenda/agenda.module').then(m => m.AgendaModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TherapistRoutingModule {}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuardService } from './services/user-guard.service';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile'
  },
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'feed',
        loadChildren: () =>
          import('./features/map/map.module').then(m => m.MapModule),
      },
      {
        path: 'questionaire',
        canActivate: [UserGuardService],
        loadChildren: () =>
          import('./features/questionaire/questionaire.module').then(m => m.QuestionaireModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module').then(m => m.ProfileModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}

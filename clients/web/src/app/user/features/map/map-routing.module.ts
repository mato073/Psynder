import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapPageComponent } from './containers/map-page/map-page.component';
import { MapComponent } from './containers/map/map.component';
import { TherapistDetailsContainerComponent } from './containers/therapist-details-container/therapist-details-container.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'map'
  },
  {
    path: '',
    component: MapPageComponent,
    children: [
        {
            path: 'map',
            component: MapComponent
        },
        {
            path: 'details/:name',
            component: TherapistDetailsContainerComponent
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { QuillModule} from 'ngx-quill';

import { SharedModule } from '../../../shared/shared.module';

import { MapRoutingModule } from './map-routing.module';

import { MapPageComponent } from './containers/map-page/map-page.component'
import { MapComponent } from './containers/map/map.component'
import { TherapistsSideMenuComponent } from './containers/therapists-side-menu/therapists-side-menu.component'
import { TherapistDetailsContainerComponent } from './containers/therapist-details-container/therapist-details-container.component'

import { TherapistMapIconComponent } from './components/therapist-map-icon/therapist-map-icon.component'
import { ProgressRingComponent } from './components/progress-ring/progress-ring.component'
import { SearchBarComponent } from './components/search-bar/search-bar.component'
import { SortDropdownMenuComponent } from './components/sort-dropdown-menu/sort-dropdown-menu.component'
import { TherapistMenuCardComponent } from './components/therapist-menu-card/therapist-menu-card.component'
import { AddressMenuSlotComponent } from './components/address-menu-slot/address-menu-slot.component';

import { AddressInputModalComponent } from './components/address-input-modal/address-input-modal.component';

import { GeoLocationService } from './services/geo-location.service'
import { MapUtilsService } from './services/map-utils.service'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MapRoutingModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAKDJcKd_F_AhY9A2qmAQLtlwgPJONmCvc',
        libraries: ['places']
    }),
    QuillModule
  ],
  declarations: [
    MapPageComponent, 
    MapComponent,
    TherapistsSideMenuComponent,
    TherapistDetailsContainerComponent,

    TherapistMapIconComponent,
    ProgressRingComponent,
    SearchBarComponent,
    SortDropdownMenuComponent,
    TherapistMenuCardComponent,
    AddressMenuSlotComponent,

    AddressInputModalComponent
  ],
  entryComponents: [AddressInputModalComponent],
  providers: [GeoLocationService, MapUtilsService]
})
export class MapModule { }

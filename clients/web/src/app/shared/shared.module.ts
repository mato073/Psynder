import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderBarComponent } from './components/header-bar/header-bar.component'
import { FooterComponent  } from './components/footer/footer.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [
    HeaderBarComponent,
    FooterComponent,
    DatePickerComponent,
    TimePickerComponent,
    ClickOutsideDirective
  ],

  exports: [
    HeaderBarComponent,
    DatePickerComponent,
    TimePickerComponent,
    ClickOutsideDirective
  ]
})
export class SharedModule { }

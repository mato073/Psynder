/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayAvailabilitiesSlotComponent } from './day-availabilities-slot.component';

describe('DayAvailabilitiesSlotComponent', () => {
  let component: DayAvailabilitiesSlotComponent;
  let fixture: ComponentFixture<DayAvailabilitiesSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayAvailabilitiesSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayAvailabilitiesSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

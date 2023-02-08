/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddressMenuSlotComponent } from './address-menu-slot.component';

describe('AddressMenuSlotComponent', () => {
  let component: AddressMenuSlotComponent;
  let fixture: ComponentFixture<AddressMenuSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressMenuSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressMenuSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

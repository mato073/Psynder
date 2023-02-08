/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TagSlotComponent } from './tag-slot.component';

describe('TagSlotComponent', () => {
  let component: TagSlotComponent;
  let fixture: ComponentFixture<TagSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

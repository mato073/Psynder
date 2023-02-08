/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { IntermediateLoginSignupPageComponent } from "./intermediate-login-signup-page.component";

describe("IntermediateLoginSignupPageComponent", () => {
  let component: IntermediateLoginSignupPageComponent;
  let fixture: ComponentFixture<IntermediateLoginSignupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediateLoginSignupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediateLoginSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

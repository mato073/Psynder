import {AbstractControl, ValidatorFn} from "@angular/forms";

export function EqualValidator(otherControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if(otherControl.value === control.value) {
      return null
    }
    return {equal: false}
  };
}

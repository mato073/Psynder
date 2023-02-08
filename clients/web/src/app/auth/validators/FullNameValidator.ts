import { AbstractControl } from "@angular/forms";

export function FullNameValidator(control: AbstractControl) {
    const fullNameRegexp : RegExp = /\s\w+/gi;
    return fullNameRegexp.test(control.value) ? null : {fullNameError: true};
}

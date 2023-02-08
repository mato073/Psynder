import { AbstractControl } from "@angular/forms";

export class CharValidators {

    specialCharValidator(control: AbstractControl): { [key: string]: boolean } {
        const specialRegexp: RegExp = /[$@:;.€!%*<>#+="#&'()+,-/?[\]^_`{|}~¢ß¥£™©®×÷±µ¿¶¯§…¤¦≠¬ˆ¨§¤]+/;
        if (control.value && !specialRegexp.test(control.value)) {
           return { noSpecialChar: true };
        }
    }

    numberValidator(control: AbstractControl): { [key: string]: boolean } {
        const nbrRegexp: RegExp = /\d/;
        if (control.value && !nbrRegexp.test(control.value)) {
           return { noNumber: true };
        }
    }

    lowerCaseValidator(control: AbstractControl): { [key: string]: boolean } {
        const lowerCaseRegexp: RegExp = /[a-z]/;
        if (control.value && !lowerCaseRegexp.test(control.value)) {
           return { noLowerCase: true };
        }
    }

    upperCaseValidator(control: AbstractControl): { [key: string]: boolean } {
        const upperCaseRegexp: RegExp = /[A-Z]/;
        if (control.value && !upperCaseRegexp.test(control.value)) {
           return { noUpperCase: true };
        }
    }

}
import { Pipe } from "@angular/core";

@Pipe({
  name: "phoneNumberPipe"
})
export class PhoneNumberPipe {
  transform(num: string) {
    if (num.length > 1 && num[0] === ' ')
      num = num.replace(' ', '');
    if (num.length === 0) {
      num = ' ';
    }
    if (num.slice(-1) === ' ')
        num = num.slice(0, -1);
    else {
        for (let i = 2; i < num.length; i += 3)
        if (num[i] !== ' ')
        num = num.slice(0, i) + ' ' + num.slice(i);
    }
    return num;
  }
}
import { Pipe } from '@angular/core';

@Pipe({
  name: 'appointmentDuration'
})
export class AppointmentDurationPipe {

  transform(value: string): string {
    let res = `${value.replace(':', 'h ')} min`;
    const regex : RegExp = /^[1-6].*/;
    while (res.length > 0 && !regex.test(res))
      res = res.substring(1);
    return res;
  }
}

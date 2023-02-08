import { Component, OnInit, Input } from '@angular/core';
import { TimeSlot } from '../../interfaces/timeslot';

@Component({
  selector: 'app-timeslot',
  templateUrl: './timeslot.component.html',
  styleUrls: ['./timeslot.component.scss']
})
export class TimeslotComponent implements OnInit {

  @Input() timeslot: TimeSlot;
  
  constructor() { }

  ngOnInit() {
  }

}

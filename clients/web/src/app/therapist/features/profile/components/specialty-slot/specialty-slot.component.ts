import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Specialty } from '../../interfaces/specialty'; 
import { SpecialtyService } from '../../services/specialty-service';

@Component({
  selector: 'app-specialty-slot',
  templateUrl: './specialty-slot.component.html',
  styleUrls: ['./specialty-slot.component.scss']
})
export class SpecialtySlotComponent implements OnInit {

  @Input() specialties: Array<Specialty>;
  @Input() contentLoaded: boolean;
  @Output() specialtiesChanged = new EventEmitter<any>();

  specialtiesEditTriggered: boolean = false;
  addSpecialtyModalShown: boolean = false;

  constructor(
    private ss: SpecialtyService
  ) { }

  ngOnInit() {
    console.log('specialties: ', this.specialties);
  }

  deleteSpecialty(specialty: Specialty) {
    this.ss.removeSpecialtyForTherapist(specialty._id).subscribe(
      (_) => this.specialtiesChanged.emit(), 
      (err) => console.log(err)
    );
  }
}

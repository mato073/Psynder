import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SpecialtyService } from '../../services/specialty-service';
import { Specialty } from '../../interfaces/specialty';

@Component({
  selector: 'app-add-specialty-modal',
  templateUrl: './add-specialty-modal.component.html',
  styleUrls: ['./add-specialty-modal.component.scss']
})
export class AddSpecialtyModalComponent implements OnInit {

  specialtyName: FormControl = new FormControl('');
  possibleSpecialties: Array<Specialty> = [];
  showPossibleSpecialties: boolean = false;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() newSpecialtyEvent = new EventEmitter<any>();

  constructor(
    private ss: SpecialtyService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.ss.getExistingSpecialties();
    this.specialtyName.valueChanges.subscribe((val: string) => {
      if (val.length === 0) {
        this.showPossibleSpecialties = false;
        return;
      }
      this.possibleSpecialties = this.ss.existingSpecialties.filter((item: Specialty) => {
        if (this.possibleSpecialties.length > 3)
          return false;
        const filter = new RegExp(`${val}`, 'i');
        return (item.name.match(filter) || item.acronym.match(filter));
      });
      this.showPossibleSpecialties = true;
      this.cdr.detectChanges();
    });
  }

  newSpecialtyValue(specialty) {
    this.specialtyName.setValue(specialty.name);
    this.showPossibleSpecialties = false;
  }


  addSpecialty() {
    this.ss.addSpecialtyToTherapist(this.specialtyName.value).then(
      (res) => {
        this.newSpecialtyEvent.emit();
        this.closeEvent.emit();
      },
      (err) => console.log(err));
  }
}

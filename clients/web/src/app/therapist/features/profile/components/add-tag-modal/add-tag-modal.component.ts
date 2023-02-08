import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProfileService } from 'src/app/therapist/features/profile/services/profile.service';

@Component({
  selector: 'app-add-tag-modal',
  templateUrl: './add-tag-modal.component.html',
  styleUrls: ['./add-tag-modal.component.scss']
})
export class AddTagModalComponent implements OnInit {

  tagName: FormControl = new FormControl('');
  @Input() tags: Array<string>;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() newTagEvent = new EventEmitter<any>();

  constructor(
    private ps: ProfileService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    console.log(this.tags);
   /* this.ss.getExistingSpecialties();
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
    });*/
  }

  newTagValue(tag) {
    this.tagName.setValue(tag.name);
  }


  addTag() {
    this.tags.push(this.tagName.value);
    this.ps.updateTags(this.tags).subscribe(
      (res) => {
        this.newTagEvent.emit();
        this.closeEvent.emit();
      },
      (err) => console.log(err));
  }
}

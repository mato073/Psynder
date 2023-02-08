import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProfileService } from 'src/app/therapist/features/profile/services/profile.service';

@Component({
  selector: 'app-tag-slot',
  templateUrl: './tag-slot.component.html',
  styleUrls: ['./tag-slot.component.scss']
})
export class TagSlotComponent implements OnInit {

  @Input() tags: Array<string>;
  @Input() contentLoaded: boolean;
  @Output() tagsChanged = new EventEmitter<any>();

  tagsEditTriggered: boolean = false;
  addTagModalShown: boolean = false;

  constructor(
    private ps: ProfileService
  ) { }

  ngOnInit() {
    console.log('tags: ', this.tags);
  }

  deleteTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
    this.ps.updateTags(this.tags).subscribe((_) => {
    },
      (err) => console.log(err));
  }
}

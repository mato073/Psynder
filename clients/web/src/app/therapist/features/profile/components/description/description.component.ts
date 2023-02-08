import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  
  @Input() contentLoaded: boolean;

  text: FormControl;
  tmpText: string;
  editToggled: boolean = false;
  
  @Input() 
  set descriptionIn(descriptionIn: string) {
    this.text = new FormControl(descriptionIn);
  }

  constructor(
    private ps: ProfileService
  ) { }

  ngOnInit() {
    this.text = new FormControl(this.descriptionIn);
  }

  toggleEdit() {
    this.editToggled = true;
    this.tmpText = this.text.value;
  }

  cancelEdit() {
    this.editToggled = false;
    this.text.setValue(this.tmpText);
  }

  saveDescription() {
    this.editToggled = false;
    this.contentLoaded = true;
    this.ps.updateDescription(this.text.value).subscribe(
      (_) => {}, 
      (err) => console.error(err)
    );
  }
}

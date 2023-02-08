import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { QuestionaireService } from '../features/questionaire/services/questionaire.service';

@Injectable()
export class UserGuardService implements CanActivate {


  constructor(
    private router: Router,
    private mini: QuestionaireService,
  ) {}
  

  canActivate(): boolean {
    if(this.mini.getData('finishedMini') === true) {
      this.router.navigateByUrl("/user/feed")
			return false;
		}
		else {
			return true;
		}
  }
}
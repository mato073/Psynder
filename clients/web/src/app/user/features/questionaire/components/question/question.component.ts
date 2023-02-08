import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import { QuestionaireService } from '../../services/questionaire.service';
import { AllCategoryTab, AllQuestions, ReturnedQuestions, AnsweredQuestions, checkSurveyResponse} from './question'
import { Router } from '@angular/router';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  yesButton: string;
  noButton: string;
  description: string;
  allQuestions: AllQuestions = null;
  questionCategory: AllCategoryTab = null;
  categoryIndex: number = 0;
  questionIndex: number = 0;
  answeredQuestions: AnsweredQuestions = {} as AnsweredQuestions;
  answers: boolean = false;
  disabled: boolean = false;
  date: boolean = false;
  endCategory: boolean = false;
  returnToLast: boolean = true;
  datePicker: Date = null;




  constructor(
    private qs: QuestionaireService,
    public datepipe: DatePipe,
    private router: Router
    ) {
      this.yesButton = "Oui";
      this.noButton = "Non";
      this.description = "";
      this.answeredQuestions.questions = {} as Array<ReturnedQuestions>;
      this.answeredQuestions.questions = [{
        name: "",
        value: ""
      }];
    }

  ngOnInit() {
    this.qs.setData(true, 'finishedMini');
    if (this.qs.getData('allQuestions'))
    {
      this.questionCategory = this.qs.getData('questionCategory');
      this.allQuestions = this.qs.getData('allQuestions');
      this.categoryIndex = this.qs.getData('categoryIndex');
      this.questionIndex = this.qs.getData('questionIndex');
      this.answeredQuestions = this.qs.getData('answeredQuestions');
      this.returnToLast = false;
      this.description = this.allQuestions.Questions[this.questionIndex].question;
    }
    else{
      this.qs.getCategoryNames()
      .then((res: AllCategoryTab) => {
        this.questionCategory = res;
        this.qs.getSurveyByName(this.questionCategory.names[this.categoryIndex])
        .then((result: AllQuestions) => {
          this.allQuestions = result;
          this.description = this.allQuestions.Questions[this.questionIndex].question;
          this.returnToLast = false;
        }).catch(function(err){
          throw err;
        });
      })
      .catch(function(err) {
        return err;
      });
   }
  }

  answer(response: string) {
    //on initialise l'interface des questions répondu pour éviter les "undefined"
    //et on désactive les boutons
    this.answeredQuestions.questions[this.questionIndex] = {
      name: "",
      value: ""
    };
    this.disabled = true;
    //on stocke les conditions du questionaire en cours, la question et sa réponse
    if(!this.answeredQuestions.conditions) {
     this.answeredQuestions.conditions = this.allQuestions.conditions;
    }
    this.answeredQuestions.questions[this.questionIndex].name = this.allQuestions.Questions[this.questionIndex].name;
   //on transforme la réponse de date pour l'api
   if (this.datePicker) {
     var day = '';
     var month = '';
     var year = 0;
     day = '0' + this.datePicker.getDay();
     month = '0' + this.datePicker.getMonth();
     year = this.datePicker.getFullYear();
     this.answeredQuestions.questions[this.questionIndex].value = day + '/' + month + '/' + year;
   }
   else {
     this.answeredQuestions.questions[this.questionIndex].value = response;
   }
   //on stocke aussi les valeurs dans l'objets possédant toutes les questions pour la création du profile médical
   this.allQuestions.Questions[this.questionIndex].answered = true;
   this.allQuestions.Questions[this.questionIndex].value = this.answeredQuestions.questions[this.questionIndex].value;
   //on réinitialise les booléens de modification du template
   this.date = false;
   this.answers = false;
   //on vérifie si une condition de sortie d'un questionaire est true ou non
   return this.qs.checkCondition(this.answeredQuestions.questions, this.answeredQuestions.conditions)
   .then((result: checkSurveyResponse) => {
     if (result.continuer === true || this.allQuestions.Questions.length <= this.answeredQuestions.questions.length) {
       this.categoryIndex = this.categoryIndex + 1;
       //si c'est la dernière catégorie, on renvoie sur la map
       if (this.categoryIndex >= this.questionCategory.names.length) {
        return this.qs.sendSurveyResult(this.allQuestions).then( () => {
          this.qs.endRedirection();
        }).catch(function(err){
          this.qs.endRedirection();
          throw err;
        });
       }
       else {
         //si il reste des catégories, on va chercher la suivante, mais on envoie avant le resultat de la categorie
        this.questionIndex = 0;
        this.answeredQuestions.questions = [];
        return this.qs.sendSurveyResult(this.allQuestions)
        .then((response: string) => {
          return this.qs.getSurveyByName(this.questionCategory.names[this.categoryIndex])
        .then((res: AllQuestions) => {
          this.allQuestions = res;
          this.description = this.allQuestions.Questions[this.questionIndex].question;
          this.answeredQuestions.conditions = this.allQuestions.conditions;
          //on sauvegarde dans le cache du navigateur certaine donnée pour pouvoir les retrouver en cas d'erreur coté utilisateur
          this.qs.setData(this.allQuestions, 'allQuestions');
          this.qs.setData(this.questionCategory, 'questionCategory');
          this.qs.setData(this.categoryIndex, 'categoryIndex');
          this.qs.setData(this.questionIndex, 'questionIndex');
          this.qs.setData(this.answeredQuestions, 'answeredQuestions');
          //on affiche la page d'entre categories
          this.date = false;
          this.answers = false;
          this.endCategory = true;
          this.description = "Remplir le plus possible le questionnaire nous aide à vous trouver les thérapeutes qui vous conviennent le plus. Si vous souhaitez quitter, pas d'inquiétude, nous sauvegardons votre progression, vous pouvez toujours revenir depuis voter page de profil";
          this.disabled = false;
        }).catch(function(err) {
          throw err;
        });
     }).catch(function(err){
       throw err;
     });
     }}
     else if (result.continuer === false)
     {
       //on continue la même catégories tant qu'aucune condition de sortie n'est trouvé
       this.questionIndex = this.questionIndex + 1;
       this.description = this.allQuestions.Questions[this.questionIndex].question;
       //on vérifie le type de la question pour changer l'affichage
       if (this.allQuestions.Questions[this.questionIndex].types[0].search("ANSWER") != -1) {
         this.date = false;
         this.answers = true;
        }
        else if (this.allQuestions.Questions[this.questionIndex].types[0].search("DATE") != -1) {
          this.answers = false;
          this.date = true;
        }
        //on sauvegarde dans le cache du navigateur certaine donnée pour pouvoir les retrouver en cas d'erreur coté utilisateur
        this.qs.setData(this.allQuestions, 'allQuestions');
        this.qs.setData(this.questionCategory, 'questionCategory');
        this.qs.setData(this.categoryIndex, 'categoryIndex');
        this.qs.setData(this.questionIndex, 'questionIndex');
        this.qs.setData(this.answeredQuestions, 'answeredQuestions');
        this.disabled = false;
      }
    }).catch(function(err) {
      return err;
    });
  }

  setDate(val: Date) { 
    this.datePicker = val; 
  }

  nextCategory() {
    this.disabled = true;
    this.endCategory = false;
    this.description = this.allQuestions.Questions[this.questionIndex].question;
    //on vérifie le type de la question pour changer l'affichage
      if (this.allQuestions.Questions[this.questionIndex].types[0].search("ANSWER") != -1) {
        this.date = false;
        this.answers = true;
      }
      else if (this.allQuestions.Questions[this.questionIndex].types[0].search("DATE") != -1) {
        this.answers = false;
        this.date = true;
      }
      this.disabled = false;
  }

  goToMap() {
    this.router.navigateByUrl("/user/feed");
  }

  backToLastQuestion() {
    this.disabled = true;
    if (this.questionIndex > 0) {
      this.questionIndex = this.questionIndex - 1;
      this.description = this.allQuestions.Questions[this.questionIndex].question;
      this.disabled = false;
      return;
    }
    else if (this.questionIndex === 0 && this.categoryIndex > 0) {
      this.categoryIndex = this.categoryIndex - 1;
      this.questionIndex = 0;
      return this.qs.getSurveyByName(this.questionCategory.names[this.categoryIndex])
      .then((result: AllQuestions) => {
        this.allQuestions = result;
        this.description = this.allQuestions.Questions[this.questionIndex].question;
        this.disabled = false;
      }).catch(function(err){
        return err;
      });
    }
    else if (this.categoryIndex === 0) {
      this.returnToLast = false;
      this.disabled = false;
      return;
    }
  }
}

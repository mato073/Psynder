  export interface AllCategoryTab {
      names: string
    }
  
  export interface forkAnswers {
    fork: string,
    value: number
  }

  export interface Answers {
    name: string,
    value: number
  }

  export interface Questions {
    name: string,
    question: string,
    types: Array<string>,
    answered: boolean,
    value: string,
    answers?: Array<Answers>,
    brutAnswer?: number,
    forksAnswers?: Array<forkAnswers>,
  }
  
export interface ObectJson {
  body: string
}

  export interface Condition {
    name: string,
    number: number,
    value: boolean
  }
  
  export interface ConditionsObject {
    condition: Array<Condition>
  }
  
  export interface AllQuestions {
    potentialDisorder: string,
    Questions: Array<Questions>,
    conditions: Array<ConditionsObject>
  }

  export interface allQuestionsJson {
    Questions: Array<Questions>,
    potentialDisorder: string
  }
  
  export interface ReturnedQuestions {
    name: string,
    value: string
  }
  
  export interface AnsweredQuestions {
    questions: Array<ReturnedQuestions>,
    conditions: Array<ConditionsObject>
  }
  
  export interface checkSurveyResponse {
    continuer: boolean,
    message: string
  }

  export interface ResultSurveyResponse {
    message: string
  }

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuizService, QuestionResponse, QuizCategory, Question, QuizParams } from '../quiz.service';
import { FormBuilder } from '@angular/forms';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @Input() params: QuizParams;
  @Output() gameOver: EventEmitter<boolean> = new EventEmitter<boolean>();

  private questions: Question[];
  currentQuestion: Question = null;
  choices: string[] = [];
  currentIndex: number = 0;
  correctIndex: number;
  errorResponse: boolean = false;
  errorMsg: string = "";
  timePerQuestions: number;
  remainingTime: number;
  answerForm;
  interval; 
  subscription;

  constructor(
    protected quizService: QuizService,
    protected formBuilder: FormBuilder,
    protected loadingService: LoadingService
    ) {
      this.answerForm = this.formBuilder.group({
        answer: ''
      });
  }

  get isLoading() {
    return this.loadingService.loading;
  }

  ngOnInit() {
    this.loadingService.onRequestStarted();
    this.subscription = this.quizService.getQuestions(
      this.params.difficulty ? this.params.difficulty : "Any",
      this.params.category ? this.params.category.toString() : "",
      10
    ).subscribe(
      ( data: QuestionResponse ) => {
        this.loadingService.onRequestEnded();
        if (!data || data.response_code != 0) {
          this.errorResponse = true;
          this.errorMsg = data.response_code == 1 ?
            "API doesn't have enough questions for your request. Sorry..." :
            "Something went wrong... we'll look into it."; 
          this.errorMsg += " Click the top left or right to return to a previous page."
          console.log(data.response_code,  ':' , data);
          return;
        }
        
        let decoded = data.results.map(x => {
          for (var prop in x) {
            x[prop] = prop === "incorrect_answers" ?
              x[prop].map( y => decodeURIComponent(y)) :
              decodeURIComponent(x[prop]);
          }

          return x;
        });

        this.timePerQuestions = this.params.isLightning ? 3 : 15;
        this.quizService.isLightning = this.params.isLightning;
        this.remainingTime = this.timePerQuestions;
        this.questions = decoded;
        this.quizService.questions = this.questions;
        this.currentQuestion = this.questions[this.currentIndex];
        this.loadChoices(this.currentQuestion);

        if (!this.params.isHardcore) {
          this.startTimer();
        }
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscription.complete();
  }

  startTimer() {
    this.remainingTime = this.timePerQuestions;
    this.interval = setInterval(() => {

      if (this.remainingTime > 0) {
        this.remainingTime--;
      }
      else {
        this.processAnswer(this.answerForm.value);
      }

    }, 1000);
  }

  loadChoices(q: Question) {
    this.choices = q.incorrect_answers;
    //console.log(q.correct_answer);
    this.choices.push(q.correct_answer);
    this.shuffleChoices();
    this.correctIndex = this.choices.findIndex( x => x === q.correct_answer );
  }

  shuffleChoices() {
    let curr = this.choices.length;
    let tmp = "", randomIndex = -1;

    while (0 !== curr) {
      randomIndex = Math.floor(Math.random() * curr);
      curr -= 1;
      tmp = this.choices[curr];
      this.choices[curr] = this.choices[randomIndex];
      this.choices[randomIndex] = tmp;
    }
  }

  resetGame() {
    this.currentQuestion = null;
    this.currentIndex = 0;
    this.correctIndex = 0;
    this.choices = [];
    this.errorMsg = "";
    this.errorResponse = false;
  }

  processTime() {
    let answerTime = this.remainingTime > 0 ? this.timePerQuestions - this.remainingTime : this.timePerQuestions;
    this.quizService.addToTime(answerTime);
    clearInterval(this.interval);
    this.remainingTime = 15;
  }

  punishment() {
    console.log("FREEEEZE!");
    setInterval(() => { 
      for(;;) {}
    }, 3000);
  }

  submit(e) {
    if (!this.params.isHardcore) {
      this.processAnswer(e);
    }
    else {
      this.processHardcoreAnswer(e);
    }
  }

  processHardcoreAnswer(e) {
    if (this.correctIndex != e.answer) {
      this.errorResponse = true;
      this.errorMsg = "Press F12 for more information. Quickly there's no time!";
      this.punishment();
    }

    this.quizService.answers.push(true);
    this.answerForm.reset();
    this.currentIndex += 1;

    if( this.quizService.answers.length === this.questions.length ) {
      this.gameOver.emit(true);
      this.resetGame();
      return;
    }

    this.currentQuestion = this.questions[this.currentIndex];
    this.loadChoices(this.currentQuestion);
  }

  processAnswer(e) {
    this.quizService.answers.push(
      (this.correctIndex == e.answer) ? true : false       
    );
    this.processTime();
    this.answerForm.reset();
    this.currentIndex += 1;

    if( this.quizService.answers.length === this.questions.length ) {
      this.gameOver.emit(true);
      this.resetGame();
      return;
    }

    this.currentQuestion = this.questions[this.currentIndex];
    this.loadChoices(this.currentQuestion);
    this.startTimer();
  }
}
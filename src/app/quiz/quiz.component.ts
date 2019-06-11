import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuizService, QuestionResponse, QuizCategory, Question, QuizParams } from '../quiz.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @Input() params: QuizParams;
  @Output() public gameOver: EventEmitter<boolean> = new EventEmitter<boolean>();

  private questions: Question[];
  currentQuestion: Question = null;
  choices: string[] = [];
  currentIndex: number = 0;
  correctIndex: number;
  answerForm;
  interval;
  timePerQuestions: number; 
  remainingTime: number;
  subscription;

  constructor(
    protected quizService: QuizService,
    protected formBuilder: FormBuilder
    ) {
      this.answerForm = this.formBuilder.group({
        answer: ''
      });
  }

  ngOnInit() {
    this.subscription = this.quizService.getQuestions(
      this.params.difficulty ? this.params.difficulty : "Any",
      this.params.category ? this.params.category.toString() : "",
      10
    ).subscribe(
      ( data: QuestionResponse ) => {
        if (!data || data.response_code != 0){
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
        this.remainingTime = this.timePerQuestions;
        this.questions = decoded;
        this.quizService.questions = this.questions;
        this.currentQuestion = this.questions[this.currentIndex];
        this.loadChoices(this.currentQuestion);
        this.startTimer();
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
    console.log(q.correct_answer);
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
  }

  processTime() {
    let answerTime = this.remainingTime > 0 ? this.timePerQuestions - this.remainingTime : this.timePerQuestions;
    this.quizService.addToTime(answerTime);
    clearInterval(this.interval);
    this.remainingTime = 15;
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
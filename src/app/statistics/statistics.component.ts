import { Component, OnInit } from '@angular/core';
import { QuizService, Question } from '../quiz.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {
  totalRight: number;
  totalWrong: number;
  overall: number;
  passFail: boolean;
  percent: number;
  correctQuestions: Question[];
  wrongQuestions: Question[];
  multipleChoice: number;
  trueFalse: number;
  finishTime: string;

  constructor(
    private quizService: QuizService
  ) { }

  ngOnInit() {
    this.finishTime = this.updateTime();
    this.multipleChoice = this.quizService.questions.filter(x => x.type === "multiple").length;
    this.trueFalse = this.quizService.questions.length - this.multipleChoice;
    this.totalRight = this.quizService.answers.filter(x => x).length;
    this.totalWrong = this.quizService.answers.length - this.totalRight;
    this.overall = this.quizService.answers.length;
    this.percent = Math.trunc( ( this.totalRight / this.overall ) * 100);
    this.passFail = ((this.percent/100) >= 0.7);
    this.correctQuestions = this.quizService.questions.filter((x,i) => this.quizService.answers[i]);
    this.wrongQuestions = this.quizService.questions.filter((x,i) => !this.quizService.answers[i]);
    this.quizService.reset();
  }

  updateTime() {
    let unprocessed = this.quizService.timeToFinish;
    let minutes = unprocessed >= 60 ? Math.floor( unprocessed / 60 ) : 0; 
    let seconds = unprocessed >= 60 ? unprocessed % 60 : unprocessed;
    let time = minutes.toString().padStart(2, '0') + " m : " + seconds.toString().padStart(2, '0') + " s";
    return time;
  }
  //TODO: ADD IN USER FUNCTIONALITY TO MAKE SCORES MAKE SENSE
  calculateScore() {
    
  }
}
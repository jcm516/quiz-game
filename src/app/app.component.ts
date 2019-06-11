import { Component } from '@angular/core';
import { PreGame, QuizParams } from './quiz.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  isParams: boolean = false;
  isClicked: boolean = false;
  isDone: boolean = false;
  options: PreGame;
  params: QuizParams;

  preGame(e) {
    this.isClicked = false;
    this.isDone = false;
    this.options = e;
    this.isParams = e.goToPreGame;
  }

  gameStart(e) {
    this.options = null;
    this.isDone = false;
    this.isParams = false;
    this.params = e;
    this.isClicked = e.gameStart;
  }

  gameDone(e) {
    this.params = null;
    this.options = null;
    this.isClicked = false;
    this.isDone = e;
  }
}

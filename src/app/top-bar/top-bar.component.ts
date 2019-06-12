import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuizService, QuizCategory, PreGame } from '../quiz.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  @Input() playAgain: boolean;
  @Output() preLoad: EventEmitter<PreGame> = new EventEmitter();

  subscription;
  preLoaded: PreGame = new PreGame();

  isClicked() {
    this.preLoaded.goToPreGame = true;
    this.preLoad.emit(this.preLoaded);
    this.subscription.complete();
  }

  constructor(
    private quizService: QuizService
  ) { }

  ngOnInit() {
    this.preLoaded.difficulties = this.quizService.difficulties;
    this.preLoaded.difficulties.unshift("Any");

    let anyOption = <QuizCategory>{id: null, name: "Any"}; 
    this.subscription = this.quizService.getAllCategories().subscribe(
      cat => {
        cat ? this.preLoaded.categories = cat.trivia_categories : this.preLoaded.categories = [];
        this.preLoaded.categories.unshift(anyOption);
      }
    );
  }

  get btnMessage() {
    return ( this.preLoaded && this.preLoaded.goToPreGame ? 
      (this.playAgain ? "Play Again?" : "Reset") 
      : "Start" );
  }
}
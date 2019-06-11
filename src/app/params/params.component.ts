import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuizService, QuizCategory, QuizParams, PreGame } from '../quiz.service';

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.css']
})
export class ParamsComponent implements OnInit {
  @Input() loadedOptions: PreGame;
  @Output() chose: EventEmitter<QuizParams> = new EventEmitter();

  selectedParams: QuizParams = new QuizParams();

  chosen() {
    this.selectedParams.gameStart = true;
    this.chose.emit(this.selectedParams);
  }

  constructor(
    private quizService: QuizService
  ) {  }

  ngOnInit() {
    this.selectedParams.category = this.loadedOptions.categories[0].id;
    this.selectedParams.difficulty = this.loadedOptions.difficulties[0];
    this.selectedParams.isLightning = false;
  }
}
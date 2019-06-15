import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


@Injectable()
export class QuizService {
  public answers: boolean [] = [];
  public questions: Question[] = [];
  public difficulties: string[] = [ "Easy", "Medium", "Hard" ];
  timeToFinish: number = 0;
  isLightning: boolean; 

  private getQuizQuestionsUrl(): string {
    return "https://opentdb.com/api.php";
  }

  private getQuizCategoriesUrl(): string {
    return "https://opentdb.com/api_category.php";
  }

  constructor(
    protected http: HttpClient
  ) { }

  reset() {
    this.answers = [];
    this.questions = [];
    this.timeToFinish = 0;
    this.isLightning = false;
  }

  addToTime(t: number) {
    this.timeToFinish += t;
  }

  public getQuestions(diff: string, category: string, amt: number) {
    diff = diff === "Any" ? "" : diff.toLowerCase();
    return this.http.get<QuestionResponse>(
      this.getQuizQuestionsUrl(),
      {
        params: {
          amount: amt.toString(),
          encode: "url3986",
          category: category,
          difficulty: diff
        }
      }
    );
  }

  public getAllCategories() {
    return this.http.get<any>(this.getQuizCategoriesUrl());
  }
}

export class PreGame {
  categories: QuizCategory[];
  difficulties: string[];
  types: string[];
  goToPreGame: boolean;
}

export interface QuestionResponse {
  response_code: number;
  results: Question[];
}

export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export class QuizParams {
  category: QuizCategory;
  difficulty: string;
  isLightning: boolean;
  isHardcore: boolean;
  gameStart: boolean;
}

export class QuizCategory {
  id: number;
  name: string;
}
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  private _loading: boolean = false;

  get loading() {
    return this._loading;
  }

  onRequestStarted() {
    this._loading = true;
  }

  onRequestEnded() {
    this._loading = false;
  } 

  constructor() { }

}
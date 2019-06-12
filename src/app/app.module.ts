import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { QuizComponent } from './quiz/quiz.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { QuizService } from './quiz.service';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ParamsComponent } from './params/params.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports:  [ 
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: QuizComponent }, 
    ])
  ],
  declarations: [ 
    AppComponent, 
    HelloComponent, 
    QuizComponent, 
    StatisticsComponent,
    TopBarComponent,
    ParamsComponent,
    FooterComponent
  ],
  bootstrap:  [ 
    AppComponent 
  ],
  providers: [
    QuizService
  ]
})
export class AppModule { }

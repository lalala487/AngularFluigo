import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HomeDealComponent } from './home-deal/home-deal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeHeaderComponent,
    HomeDealComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

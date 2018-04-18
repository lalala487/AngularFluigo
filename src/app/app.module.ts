import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HomeDealComponent } from './home-deal/home-deal.component';
import { HeaderComponent } from './header/header.component';
import { DealCardComponent } from './deal-card/deal-card.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeHeaderComponent,
    HomeDealComponent,
    HeaderComponent,
    DealCardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

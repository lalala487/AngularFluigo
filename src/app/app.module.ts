import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarJSModule } from 'ng-sidebarjs';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DealCardComponent } from './deal-card/deal-card.component';
import { DetailComponent } from './detail/detail.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';
import { DocPipe } from './doc.pipe';
import { FirestoreService } from './services/firestore.service';
import { MomentModule } from 'ngx-moment';

import { DateCountdownCircleComponent } from './date-countdown-circle/date-countdown-circle.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { CityComponent } from './city/city.component';
import { AccommodationComponent } from './accommodation/accommodation.component';
import { UserQuantityComponent } from './user-quantity/user-quantity.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DealCardComponent,
    DetailComponent,
    FooterComponent,
    HomeComponent,
    DocPipe,
    DateCountdownCircleComponent,
    DealDetailComponent,
    CityComponent,
    AccommodationComponent,
    UserQuantityComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    SidebarJSModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    MomentModule,
  ],
  providers: [FirestoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }

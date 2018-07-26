import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarJSModule } from 'ng-sidebarjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DealCardComponent } from './deal-card/deal-card.component';
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
import { UserAgeComponent } from './user-age/user-age.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityOptionComponent } from './activity-option/activity-option.component';
import { OnBoardComponent } from './on-board/on-board.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { UserDataComponent } from './user-data/user-data.component';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';
import { ImageService } from './services/image.service';
import { ReviewComponent } from './review/review.component';
import { FeaturedIconComponent } from './featured-icon/featured-icon.component';
import { RatingComponent } from './rating/rating.component';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { AgesChildrenComponent } from './ages-children/ages-children.component';
import { CalendarModule } from 'angular-calendar';
import { FormsModule } from '../../node_modules/@angular/forms';
import { CalendarOptionComponent } from './calendar-option/calendar-option.component';
import { FlightTimeComponent } from './flight-time/flight-time.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DealCardComponent,
    FooterComponent,
    HomeComponent,
    DocPipe,
    DateCountdownCircleComponent,
    DealDetailComponent,
    CityComponent,
    AccommodationComponent,
    UserQuantityComponent,
    UserAgeComponent,
    CalendarComponent,
    ActivitiesComponent,
    ActivityDetailComponent,
    ActivityOptionComponent,
    OnBoardComponent,
    InsuranceComponent,
    UserDataComponent,
    PaymentComponent,
    SuccessComponent,
    ReviewComponent,
    FeaturedIconComponent,
    RatingComponent,
    NumberPickerComponent,
    AgesChildrenComponent,
    CalendarOptionComponent,
    FlightTimeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    FormsModule,
    SidebarJSModule.forRoot(),
    CalendarModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    MomentModule,
  ],
  providers: [FirestoreService, ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

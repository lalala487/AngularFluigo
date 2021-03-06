import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, registerLocaleData } from '@angular/common';
import { DealCardComponent } from './deal-card/deal-card.component';
import { FooterComponent } from './footer/footer.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeDe from '@angular/common/locales/de';
import { AirportListComponent } from './airport-list/airport-list.component';
import { FormsModule } from '@angular/forms';
import { NightsComponent } from './nights/nights.component';
import { StepProgressComponent } from './step-progress/step-progress.component';
import { CityComponent } from './city/city.component';
import { ReviewComponent } from './review/review.component';
import { InterestComponent } from './interest/interest.component';
import { AccommodationComponent } from './accommodation/accommodation.component';
import { RatingComponent } from './rating/rating.component';
import { UserQuantityComponent } from './user-quantity/user-quantity.component';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { AgesChildrenComponent } from './ages-children/ages-children.component';
import { TransportationComponent } from './transportation/transportation.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { UserDataComponent } from './user-data/user-data.component';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptor } from './token.interceptor';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { TeamComponent } from './team/team.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { ActivitiesComponent } from './activities/activities.component';
import { SuccessComponent } from './success/success.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityListItemComponent } from './activity-list-item/activity-list-item.component';
import { ActivityDateComponent } from './activity-date/activity-date.component';
import { DateCountdownCircleComponent } from './date-countdown-circle/date-countdown-circle.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AccountDataComponent } from './account-data/account-data.component';
import { AccountAssistantComponent } from './account-assistant/account-assistant.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { AccountOrdersComponent } from './account-orders/account-orders.component';
import { OrderListItemComponent } from './order-list-item/order-list-item.component';
import { AccountOrderDocumentListComponent } from './account-order-document-list/account-order-document-list.component';
import { AccountOrderDocumentListItemComponent } from './account-order-document-list-item/account-order-document-list-item.component';
import { AccountOrderDocumentsComponent } from './account-order-documents/account-order-documents.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { OfflineComponent } from './offline/offline.component';
import { LanguageComponent } from './language/language.component';
import { TravelGuideComponent } from './travel-guide/travel-guide.component';
import { CarouselComponent } from './carousel/carousel.component';
import { GradingComponent } from './grading/grading.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { TravelGuideListComponent } from './travel-guide-list/travel-guide-list.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { PriceLevelComponent } from './price-level/price-level.component';
import { HeartListComponent } from './heart-list/heart-list.component';
import { GuideDayScheduleComponent } from './guide-day-schedule/guide-day-schedule.component';
import { TravelGuideHistoryComponent } from './travel-guide-history/travel-guide-history.component';
import { TravelGuideCultureComponent } from './travel-guide-culture/travel-guide-culture.component';
import { TravelGuideCtaComponent } from './travel-guide-cta/travel-guide-cta.component';
import { FeaturedComponent } from './featured/featured.component';
import { NoActivitiesComponent } from './no-activities/no-activities.component';
import { SidebarModule } from 'ng-sidebar';
import { LuggageComponent } from './luggage/luggage.component';
import { LuggageDetailComponent } from './luggage-detail/luggage-detail.component';
import { UspComponent } from './usp/usp.component';
import { ReferComponent } from './refer/refer.component';


registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DateCountdownCircleComponent,
    DealCardComponent,
    FooterComponent,
    DealDetailComponent,
    CalendarComponent,
    AirportListComponent,
    NightsComponent,
    StepProgressComponent,
    CityComponent,
    ReviewComponent,
    InterestComponent,
    AccommodationComponent,
    RatingComponent,
    UserQuantityComponent,
    NumberPickerComponent,
    AgesChildrenComponent,
    TransportationComponent,
    InsuranceComponent,
    UserDataComponent,
    PaymentFormComponent,
    AuthComponent,
    EmailSentComponent,
    LoginComponent,
    TermsConditionsComponent,
    TeamComponent,
    DataProtectionComponent,
    CustomerServiceComponent,
    ActivitiesComponent,
    SuccessComponent,
    ActivityDetailComponent,
    ActivityListItemComponent,
    ActivityDateComponent,
    LogoutComponent,
    AccountComponent,
    AccountDataComponent,
    AccountAssistantComponent,
    AccountProfileComponent,
    AccountOrdersComponent,
    AccountOrderDocumentsComponent,
    OrderListItemComponent,
    AccountOrderDocumentListComponent,
    AccountOrderDocumentListItemComponent,
    TemperatureComponent,
    OfflineComponent,
    LanguageComponent,
    TravelGuideComponent,
    CarouselComponent,
    GradingComponent,
    ChatBotComponent,
    TravelGuideListComponent,
    RestaurantComponent,
    PriceLevelComponent,
    HeartListComponent,
    GuideDayScheduleComponent,
    TravelGuideHistoryComponent,
    TravelGuideCultureComponent,
    TravelGuideCtaComponent,
    FeaturedComponent,
    NoActivitiesComponent,
    LuggageComponent,
    LuggageDetailComponent,
    UspComponent,
    ReferComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    NgbModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripeKey),
    FormsModule,
    SidebarModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit, Input } from '@angular/core';
import { Deal } from '../models/deal';
import { UserContact } from '../models/user-contact';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ImageService } from '../services/image.service';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Money, Currencies } from 'ts-money';

import { switchMap } from 'rxjs/operators';
import { Accummulation } from '../models/fields/accummulation';
import { City } from '../models/city';
import { SafeStyle } from '@angular/platform-browser';
import { Accommodation } from '../models/accommodation';
import { Observable } from 'rxjs';
import { Birthday } from '../models/birthday';
import { environment } from 'src/environments/environment';
import { StepValidatorService } from '../services/step-validator.service';
import { ToastrService } from 'ngx-toastr';
import { Charge } from '../payment-form/payment-models';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { PaymentService } from '../services/payment.service';
import { Activity } from '../models/activity';
import { Offer } from '../models/offer';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivityPack } from '../models/activity-pack';


@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['./deal-detail.component.css']
})
export class DealDetailComponent implements OnInit {
  @Input() deal: Deal;
  city: City;
  accommodation$: Observable<Accommodation>;
  imageUrl: SafeStyle;

  emailSent = false;

  locale = environment.locale;
  localeSimple = environment.localeSimple;

  accummulations: Accummulation = {
    'hasFlightAccommodation': false,
    'hasTransportation': true,
    'transportationPrice': new Money(0, Currencies.CHF),
    'hasInsurance': true,
    'insurancePrice': new Money(0, Currencies.CHF),
    'flightAccommodationPrice': new Money(0, Currencies.CHF),
    'adultPrice': new Money(0, Currencies.CHF),
    'childrenPrice': new Money(0, Currencies.CHF),
    'totalPriceAmount': new Money(0, Currencies.CHF),
    'bookingFee': new Money(0, Currencies.CHF),
    'children': 0,
    'birthday0': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday1': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday2': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday3': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday4': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday5': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'contact': {} as UserContact,
    'activities': new Map(),
  } as Accummulation;

  currentStep = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private db: AngularFirestore,
    private stepValidatorService: StepValidatorService,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    private paymentService: PaymentService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    const selectedDeal$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const query = ref => ref.where('slug', '==', params.get('slug')).limit(1);

        return this.db.collection('deal', query).valueChanges();
      })
    );

    selectedDeal$.subscribe((deals: Deal[]) => {
      if (deals.length === 0) {
        this.toastr.error('No deal found for the slug supplied', 'Ehm...');

        this.router.navigate(['/']);
      }

      this.deal = deals[0];

      if (this.deal.endDate.toDate() < new Date()) {
        this.toastr.error('Das Angebot ist beendet', 'Ehm...');

        this.router.navigate(['/']);
      }

      if (this.deal.marketing) {
        this.accummulations.startDate = this.deal.marketing.departingFlight;
        this.accummulations.endDate = this.deal.marketing.returningFlight;
        this.accummulations.totalPriceAmount = Money.fromDecimal(this.deal.marketing.price, Currencies.CHF, Math.ceil);

        this.accummulations['numberOfNights'] = this.deal.marketing.nights;
        this.accummulations['adults'] = this.deal.marketing.adults;
        this.accummulations['children'] = this.deal.marketing.children;
        this.accummulations['total'] = this.deal.marketing.children + this.deal.marketing.adults;
      }

      if (this.deal.bookingFee) {
        this.accummulations.bookingFee = Money.fromDecimal(this.deal.bookingFee, Currencies.CHF, Math.ceil);
      }

      const cityRef: DocumentReference = this.deal.city ? this.deal.city[0] : undefined;

      if (cityRef) {
        this.accummulations.city = cityRef;
        this.db.doc(cityRef.path).valueChanges().subscribe(innerCity => {
          this.city = innerCity as City;

          const image = innerCity['image'].main;

          this.imageService.getImageDownloadUrl$(image).subscribe(
            url => this.imageUrl = this.imageService.sanitizeImage(url)
          );

        });
      }

      const accommodationDoc = this.deal.accommodation ? this.deal.accommodation[0] : undefined;
      if (accommodationDoc) {
        this.accummulations.accommodation = accommodationDoc;
        this.accommodation$ = this.db.doc<Accommodation>(accommodationDoc.path).valueChanges();
      }

      const merchantRef = this.deal.merchant ? this.deal.merchant[0] : undefined;
      if (merchantRef) {
        this.accummulations['merchantId'] = merchantRef.id;
      }
    });
  }

  goToStep(step: number) {
    if (step < this.currentStep) {
      this.scrollToTopOfTheSection();
      this.currentStep = step;
    }
  }

  moveToNextStep(): void {
    this.scrollToTopOfTheSection();

    if (this.currentStep === 2 && this.accummulations.children === 0) {
      this.currentStep = this.currentStep + 2;
    } else if (this.currentStep === 3 && this.accummulations.children > 0) {
      // when adding children, but add valid dates for them

      const dates: Array<Birthday> = Array(this.accummulations.children);
      let currentNumber = 0;
      while (currentNumber < this.accummulations.children) {
        dates[currentNumber] = this.accummulations['birthday' + currentNumber];
        currentNumber++;
      }

      if (!this.stepValidatorService.validateChildrenBirthdays(dates)) {
        this.toastr.error('Alles richtig ausgefüllt?', 'Ehm...', {
          progressBar: true
        });
      } else {
        this.currentStep = this.currentStep + 1;
      }
      return;
    } else if (this.currentStep === 4) {
      if (!this.accummulations.event) {
        this.toastr.error('Alles richtig ausgefüllt?', 'Ehm...', {
          progressBar: true
        });
        return;
      }

      this.currentStep = this.currentStep + 1;
    } else if (this.currentStep === 5 && !this.accummulations.activity) {
      this.currentStep = this.currentStep + 3;
    } else if (this.currentStep === 7) {
      // activity date, must choose date to proceed
      if (!this.accummulations.activityOffer) {
        this.toastr.error('Alles richtig ausgefüllt?', 'Ehm...', {
          progressBar: true
        });
      } else {
        this.currentStep = this.currentStep + 1;
      }
    } else if (this.currentStep === 10) {
      // contact step (must be filled in order to proceed)
      if (!this.stepValidatorService.validateUserContact(this.accummulations.contact)) {
        this.toastr.error('Alles richtig ausgefüllt?', 'Ehm...', {
          progressBar: true
        });
      } else {
        this.currentStep = this.currentStep + 1;
      }
      return;
    } else {
      this.currentStep = this.currentStep + 1;
    }
  }

  private scrollToTopOfTheSection() {
    const top = document.getElementById('top');
    if (top !== null) {
      top.scroll(0, 0);
    }
  }

  moveToPreviousStep(): void {
    if (this.currentStep === 0) {
      this.router.navigate(['/']);
      return;
    }

    this.scrollToTopOfTheSection();
    if (this.currentStep === 4 && this.accummulations.children === 0) {
      this.currentStep = this.currentStep - 2;
    } else if (this.currentStep === 6) {
      this.accummulations.activity = null;
      this.currentStep = this.currentStep - 1;
    } else if (this.currentStep === 8 && !this.accummulations.activity) {
      // when we don't have activities, we jump back by 3 steps
      this.currentStep = this.currentStep - 3;
    } else {
      this.currentStep = this.currentStep - 1;
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  hasTransportationChange(hasTransportation: boolean) {
    this.accummulations.hasTransportation = hasTransportation;
    this.calculatePrice();
  }

  transportationPriceChange(transportationPrice: Money) {
    this.accummulations.transportationPrice = transportationPrice;
    this.calculatePrice();
  }

  hasInsuranceChange(hasInsurance: boolean) {
    this.accummulations.hasInsurance = hasInsurance;
    this.calculatePrice();
  }

  insurancePriceChange(insurancePrice: Money) {
    this.accummulations.insurancePrice = insurancePrice;
    this.calculatePrice();
  }

  userContactChange(contact: UserContact) {
    this.accummulations.contact = contact;
  }

  stripeResult(charge: Charge): void {
    this.afAuth.user.subscribe(user => {
      if (!user) {
        return;
      }

      this.paymentService.writePaymentToDb(charge, user.uid).then(result => {
        this.accummulations['payed'] = true;
        this.accummulations['payment'] = result;
        this.moveToNextStep();
      });

    });

  }

  errorStripe(error): void {
    this.toastr.error(error);
  }

  calculatePrice() {
    let price = new Money(0, Currencies.CHF);

    if (this.accummulations['hasFlightAccommodation']) {
      price = price.add(this.accummulations['childrenPrice']).add(this.accummulations['adultPrice']);
    }

    if (this.accummulations['hasUpsell']) {
      price = price.add(this.accummulations['upsellPrice']);
    }

    if (this.accummulations['hasTransportation']) {
      price = price.add(this.accummulations['transportationPrice']);
    }

    if (this.accummulations['hasInsurance']) {
      price = price.add(this.accummulations['insurancePrice']);
    }

    this.accummulations.activities.forEach((value: ActivityPack, key: string) => {
      price = price.add(value.offer.price);
    });

    price = price.add(this.accummulations['bookingFee']);

    this.accummulations['totalPriceAmount'] = price;
  }

  isLoggedInChange(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      this.ngxSmartModalService.close('loginModal');
    } else {
      this.ngxSmartModalService.open('loginModal');
    }
  }

  emailSentChanged(emailSent: boolean): void {
    this.emailSent = emailSent;
  }

  moveToDateSelectionEvent(moving: boolean): void {
    this.moveToNextStep();
  }

  selectedActivityChange(activity: Activity) {
    if (activity === null) {
      this.moveToNextStep();

      return;
    }

    const pack = {
      activity: activity,
      offer: null
    } as ActivityPack;

    if (activity.selected) {
      this.accummulations.activities.set(activity.id, pack);
    } else if (this.accummulations.activities.has(activity.id)) {
      this.accummulations.activities.delete(activity.id);

      this.accummulations.activity = null;
      this.accummulations.activityOffer = null;

      this.calculatePrice();
    }

    this.accummulations.activity = activity;

    if (activity.selected) {
      this.moveToNextStep();
    }
  }

  selectedActivityOfferChange(activityPack: ActivityPack) {
    this.accummulations.activities.set(activityPack.activity.id, activityPack);

    this.accummulations.activityOffer = activityPack.offer;

    this.calculatePrice();
  }
}

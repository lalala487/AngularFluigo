import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FirestoreService } from '../services/firestore.service';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { Deal } from '../models/deal';
import { City } from '../models/city';
import { Accommodation } from '../models/accommodation';
import { environment } from '../../environments/environment.prod';
import { Birthday } from '../models/birthday';
import { StepValidatorService } from '../services/step-validator.service';
import { Airport } from '../models/airport';

import { Money, Currencies } from 'ts-money';
import { User } from '../models/user';
import { Charge } from '../payment-form/models';
import { PaymentService } from '../payments/payment.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['./deal-detail.component.css'],
  providers: [StepValidatorService, PaymentService]
})
export class DealDetailComponent implements OnInit {
  slug: string;
  @Input() deal: Deal;
  accommodationDoc: any;
  city: City;
  accommodation: Accommodation;
  imageUrl: SafeStyle;

  locale = environment.locale;

  accummulations = {
    'people': 2,
    'adults': 2,
    'children': 0,
    'childrenBirthdays': Object,
    'birthday0': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday1': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday2': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday3': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday4': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'birthday5': { 'day': '', 'month': '', 'year': '' } as Birthday,
    'hasChildren': false,
    'startDate': undefined,
    'endDate': undefined,
    'numberOfNights': 3,
    'events': {
      'nights': 3,
      'airport': { name: 'Zürich', value: 'hfVxPrPOE7ct3L3Iy5Eg' } as Airport,
      'list': []
    },
    'eventSelected': undefined,
    'hasUpsell': true,
    'upsellPrice': new Money(0, Currencies.CHF),
    'hasTransportation': true,
    'transportationPrice': new Money(0, Currencies.CHF),
    'hasInsurance': true,
    'insurancePrice': new Money(0, Currencies.CHF),
    'hasFlightAccommodation': false,
    'flightAccommodationPrice': new Money(0, Currencies.CHF),
    'adultPrice': new Money(0, Currencies.CHF),
    'childrenPrice': new Money(0, Currencies.CHF),
    'totalPriceAmount': new Money(0, Currencies.CHF),
    'contact': new User(),
    'bookingFee': new Money(0, Currencies.CHF),
    'payed': false
  };

  currentStep = 0;

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService,
    private imageService: ImageService,
    private stepValidatorService: StepValidatorService,
    private router: Router,
    private paymentService: PaymentService,
    public toastr: ToastsManager,
    public ngxSmartModalService: NgxSmartModalService,
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.slug = params.get('slug');

        return this.db.col$('deal', ref => ref.where('slug', '==', this.slug));
      }).subscribe(deals => {
        this.deal = deals ? deals[0] as Deal : undefined;

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

        this.accommodationDoc = this.deal.accommodation ? this.deal.accommodation[0] : undefined;
        const cityRef = this.deal.city ? this.deal.city[0] : undefined;

        if (cityRef) {
          this.db.doc$('city/' + cityRef.id).subscribe(innerCity => {
            this.city = innerCity as City;

            const image = innerCity['image'].main;

            this.imageService.getImageDownloadUrl$(image).subscribe(
              url => this.imageUrl = this.imageService.sanitizeImage(url)
            );
          });
        }

        if (this.accommodationDoc) {
          this.db.doc$('accommodation/' + this.accommodationDoc.id).subscribe(innerAcc => {
            this.accommodation = innerAcc as Accommodation;
          });
        }
      });
  }

  calculatePrice(): void {
    let price = new Money(0, Currencies.CHF);
    console.log('calculate price', this.accummulations);

    if (this.accummulations['hasFlightAccommodation']) {

      price = price.add(this.accummulations['childrenPrice']).add(this.accummulations['adultPrice']);
    }

    if (this.accummulations['hasUpsell']) {
      price = price.add(this.accummulations['upsellPrice']);
      console.log('upsellPrice', this.accummulations['upsellPrice'], 'totalPrice', price);
    }

    if (this.accummulations['hasTransportation']) {
      price = price.add(this.accummulations['transportationPrice']);
      console.log('transportationPrice', this.accummulations['transportationPrice'], 'totalPrice', price);
    }

    if (this.accummulations['hasInsurance']) {
      price = price.add(this.accummulations['insurancePrice']);
      console.log('insurancePrice', this.accummulations['insurancePrice'], 'totalPrice', price);
    }

    price = price.add(this.accummulations['bookingFee']);

    this.accummulations['totalPriceAmount'] = price;
  }

  hasUpsellChange(hasUpsell: boolean) {
    this.accummulations['hasUpsell'] = hasUpsell;
    this.calculatePrice();
    console.log('hasUpsellChange', hasUpsell, this.accummulations);
  }

  upsellPriceChange(upsellPrice: Money) {
    this.accummulations['upsellPrice'] = upsellPrice;
    this.calculatePrice();
    console.log('upsellPriceChange', upsellPrice, this.accummulations);
  }

  hasTransportationChange(hasTransportation: boolean) {
    this.accummulations['hasTransportation'] = hasTransportation;
    this.calculatePrice();
    console.log('hasTransportationChange', hasTransportation, this.accummulations);
  }

  transportationPriceChange(transportationPrice: Money) {
    this.accummulations['transportationPrice'] = transportationPrice;
    this.calculatePrice();
    console.log('transportationPriceChange', transportationPrice, this.accummulations);
  }

  hasInsuranceChange(hasInsurance: boolean) {
    this.accummulations['hasInsurance'] = hasInsurance;
    this.calculatePrice();
    console.log('hasInsuranceChange', hasInsurance, this.accummulations);
  }

  insurancePriceChange(insurancePrice: Money) {
    this.accummulations['insurancePrice'] = insurancePrice;
    this.calculatePrice();
    console.log('insurancePriceChange', insurancePrice, this.accummulations);
  }

  hasFlightAccommodationChange(hasFlightAccommodation: boolean) {
    this.accummulations['hasFlightAccommodation'] = hasFlightAccommodation;
    this.calculatePrice();
    console.log('hasFlightAccommodationChange', hasFlightAccommodation, this.accummulations);
  }

  flightAccommodationPriceChange(flightAccommodationPrice: Money) {
    this.accummulations['flightAccommodationPrice'] = flightAccommodationPrice;
    this.calculatePrice();
    console.log('flightAccommodationPriceChange', flightAccommodationPrice, this.accummulations);
  }

  adultPriceChange(adultPrice: Money) {
    this.accummulations['adultPrice'] = adultPrice;
    this.calculatePrice();
    console.log('adultPriceChange', adultPrice, this.accummulations);
  }

  childrenPriceChange(childrenPrice: Money) {
    this.accummulations['childrenPrice'] = childrenPrice;
    this.calculatePrice();
    console.log('childrenPriceChange', childrenPrice, this.accummulations);
  }

  stripeResult(charge: Charge): void {
    console.log('stripeResult', charge);

    this.paymentService.writePaymentToDb(charge);
    this.accummulations['payed'] = true;

    this.moveToNextStep();
  }

  errorStripe(error): void {
    console.log('stripeError', error);

    this.toastr.error(error.statusText, 'Error');
  }

  moveToNextStep(): void {
    if (this.currentStep === 12) {
      if (!this.accummulations['payed']) {
        return;
      }
    }

    if (this.currentStep === 3 && this.accummulations.children > 0) {
      console.log('struct', this.accummulations);

      const dates: Array<Birthday> = Array(this.accummulations.children);
      let currentNumber = 0;
      while (currentNumber < this.accummulations.children) {
        dates[currentNumber] = this.accummulations['birthday' + currentNumber];
        currentNumber++;
      }

      if (!this.stepValidatorService.validateChildrenBirthdays(dates)) {
        this.toastr.error('"Das Datum ist nicht korrekt eingefühlt"', 'Error');

        return;
      }
    }

    // calendar step (ignore acivities for now)
    if (this.currentStep === 4) {
      if (this.accummulations['eventSelected'] !== undefined) {
        this.currentStep = this.currentStep + 5;
      }

      return;
    }

    // contact step (must be filled in order to process)
    if (this.currentStep === 11) {
      if (this.stepValidatorService.validateUserContact(this.accummulations.contact)) {
        this.currentStep = this.currentStep + 1;
      } else {
        this.toastr.error('"Das Datum ist nicht korrekt eingefühlt"', 'Error');
      }

      return;
    }

    if (this.currentStep === 2 && this.accummulations.children === 0) {
      this.currentStep = this.currentStep + 2;
    } else {
      this.currentStep = this.currentStep + 1;
    }
  }

  moveToPreviousStep(): void {
    if (this.currentStep === 0) {
      this.router.navigate(['/']);
      return;
    }

    if (this.currentStep === 4 && this.accummulations.children === 0) {
      this.currentStep = this.currentStep - 2;
    } else if (this.currentStep === 9) {
      // ignore activities for now
      this.currentStep = this.currentStep - 5;

    } else {
      this.currentStep = this.currentStep - 1;
    }
  }

  isLoggedInChange(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      this.ngxSmartModalService.close('loginModal');
    } else {
      this.ngxSmartModalService.open('loginModal');
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { CollectionsService } from '../services/collections.service';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';
import { FirestoreService } from '../services/firestore.service';
import {
  startOfDay,
  endOfDay
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { Deal } from '../models/deal';
import { Flight } from '../models/flight';
import { Offer } from '../models/offer';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [CollectionsService]
})
export class CalendarComponent implements OnInit {
  @Input() deal: Deal;
  @Input() accummulations: Object;

  numberOfNights: Number = 3;

  events: CalendarEvent[] = [];
  flights = [];

  wayOffers: Offer[] = [];
  returnOffers: Offer[] = [];
  roomOffers: Map<Number, Offer> = new Map();

  flightOffers: Observable<any[]>;
  accommodationOffers: Observable<any[]>;

  completeOffers: any[] = [];

  viewDate: Date = new Date();
  view = 'month';
  refresh: Subject<any> = new Subject();

  constructor(
    private collectionUtils: CollectionsService,
    protected db: FirestoreService
  ) { }

  ngOnInit() {
    this.updateCalendarEvents();
  }

  updateCalendarEvents() {
    const dealFlights = this.collectionUtils.getCollection<Flight>(this.deal.flights);
    console.log('deal flights', dealFlights);

    console.log('deal,merchant', this.deal.merchant[0].id);

    // TODO: only look at future offers
    this.flightOffers = this.db.colWithIds$('flightOffer');

    this.accommodationOffers = this.db.colWithIds$('accommodationOffer');


    const dealMerchantId = this.deal.merchant[0].id;

    const amsterdamAirport = 'JFAnSriEs0g7XS2MlxVk';
    const zurichAirport = 'hfVxPrPOE7ct3L3Iy5Eg';

    this.accommodationOffers.subscribe(collection => {
      collection.forEach(accommodationOffer => {
        console.log('accommodationOffer: ', accommodationOffer);

        const accommodationOfferId = accommodationOffer.id;

        if (!accommodationOffer.merchant) {
          return;
        }

        // merchant of the accommodationOffer offer must be the same as the one of the deal
        if (dealMerchantId !== accommodationOffer.merchant[0].id) {
          return;
        }

        // TODO: verificar que accommodationOffer.room.accommodation.city == city do deal

        this.db.colWithIds$<Offer>('accommodationOffer/' + accommodationOfferId + '/offers').subscribe(col => {
          col.forEach(offer => {
            console.log('roomOffer', offer);
            this.roomOffers.set(offer.date.getTime(), offer);
            console.log('roomOffers', this.roomOffers);
            console.log('roomOffers[date]', this.roomOffers.get(offer.date));
          });
        });
      });
    });

    this.flightOffers.subscribe(collection => {
      collection.forEach(flightOffer => {
        console.log('offer: ', flightOffer);
        console.log('offer.flight', flightOffer.flight);

        const flightOfferId = flightOffer.id;
        console.log('offerId: ', flightOfferId);
        const dealFlightIds = this.getIds(dealFlights);

        if (!flightOffer.flight) {
          return;
        }

        if (!flightOffer.merchant) {
          return;
        }

        const flightOfferFlight = flightOffer.flight[0];
        // (offer flight must be part of the list of flights of the deal)
        if (!dealFlightIds.includes(flightOfferFlight.id)) {
          return;
        }

        // merchant of the flight offer must be the same as the one of the deal
        if (dealMerchantId !== flightOffer.merchant[0].id) {
          return;
        }

        console.log('flightOffer.flight[0]', flightOfferFlight);

        let isReturn = false;
        this.db.doc$('flight/' + flightOfferFlight.id).subscribe(flight => {
          console.log('flight.origin', flight['origin']);
          if (flight['origin'][0].id === amsterdamAirport && flight['destination'][0].id === zurichAirport) {
            isReturn = true;
          }
        });

        this.db.colWithIds$<Offer>('flightOffer/' + flightOfferId + '/offers').subscribe(col => {
          console.log('inneroffers: ', col);
          col.forEach(offer => {
            if (isReturn) {
              this.returnOffers.push(offer);
            } else {
              this.wayOffers.push(offer);
            }

            console.log('inner offer', offer);
            // this.events.push({
            //   // TODO: this logic by age segment doesn't make sense,
            //   // I should sum the price for each of the segments needed from the previous choice
            //   title: offer.prices[0].amount + ' ' + flightOffer.currency,
            //   start: startOfDay(offer.date),
            //   end: endOfDay(offer.date),
            // });
            // this.refresh.next();
          });
          console.log('events', this.events);
          console.log('wayOffers', this.wayOffers);
          console.log('returnOffers', this.returnOffers);
        });

        console.log('wayOffers2', this.wayOffers);
        console.log('returnOffers2', this.returnOffers);

      });

      setTimeout(() => {
        this.events = [];
        this.wayOffers.forEach(wayOffer => {
          this.returnOffers.forEach(returnOffer => {
            const differenceInDays = moment(returnOffer.date).diff(moment(wayOffer.date), 'days');

            console.log('differenceInDays', differenceInDays, 'numberOfNights', this.numberOfNights);

            if (differenceInDays === this.numberOfNights) {

              console.log('!!We have way and return offers separated by the number of Nights we want!!');

              const price = this.computeFlightOffersTotalPrice(wayOffer, returnOffer);
              console.log('price', price);

              this.completeOffers.push({
                'way': wayOffer,
                'return': returnOffer,
                'totalPrice': price
              });

              if (this.checkIfThereAreRoomOffersInTheInterval(wayOffer.date)) {
                const totalPrice = price + this.completeRoomOfferTotalPrice(wayOffer.date);

                console.log('price', price, 'roomPrices', this.completeRoomOfferTotalPrice(wayOffer.date));

                const event = {
                  // TODO: this logic by age segment doesn't make sense,
                  // I should sum the price for each of age the segments needed from the previous choice
                  title: totalPrice + ' CHF', // TODO: consider currency + flightOffer.currency,
                  start: startOfDay(wayOffer.date),
                  end: endOfDay(wayOffer.date),
                };

                console.log('creating event', event);

                this.events.push(event);
                console.log('events', this.events);
                this.refresh.next();
              }

            }

            return;
          });
        });

        console.log('completeOffers', this.completeOffers);
      }, 2000);
    });
  }

  checkIfThereAreRoomOffersInTheInterval(startDate): boolean {
    console.log('checkIfThereAreRoomOffersInTheInterval');
    for (let index = 0; index < this.numberOfNights; index++) {
      const currentDate = moment(startDate).add(index, 'days').valueOf();

      console.log('currentDate', currentDate, this.roomOffers);
      console.log('roomOfferFordate', this.roomOffers.get(currentDate));

      if (!this.roomOffers.has(currentDate)) {
        return false;
      }
    }

    return true;
  }

  completeRoomOfferTotalPrice(startDate): number {
    let price = 0;
    for (let index = 0; index < this.numberOfNights; index++) {
      const currentDate = moment(startDate).add(index, 'days').valueOf();
      const roomOffer = this.roomOffers.get(currentDate);

      price = price + roomOffer.prices[0].amount;
    }

    // TODO: use adults/children and instead of [0], use the right segment
    return this.accummulations['adults'] * price;
  }

  computeFlightOffersTotalPrice(offer1, offer2) {
    // TODO: use adults/children and instead of [0], use the right segment
    return this.accummulations['adults'] * (offer1.prices[0].amount + offer2.prices[0].amount);
  }

  getIds(list: Array<any>) {
    return list.map(item => item.id);
  }

  selectedNightChange(night) {
    console.log('number of nights changed to', night);
    this.numberOfNights = +night;

    this.updateCalendarEvents();
  }
}

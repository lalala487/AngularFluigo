import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CollectionsService } from '../services/collections.service';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';
import { FirestoreService } from '../services/firestore.service';
import {
  startOfDay,
  endOfDay,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { Deal } from '../models/deal';
import { Flight } from '../models/flight';
import { Offer } from '../models/offer';
import * as moment from 'moment';
import { Airport } from '../models/airport';
import { Segment } from '../models/segment';
import { Money, Currencies } from 'ts-money';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [CollectionsService]
})
export class CalendarComponent implements OnInit {
  @Input() deal: Deal;
  @Input() accummulations: Object;

  @Input() hasFlightAccommodation: boolean;
  @Input() flightAccommodationPrice: Money;
  @Input() adultPrice: Money;
  @Input() childrenPrice: Money;


  @Output() hasFlightAccommodationChange: EventEmitter<boolean> = new EventEmitter();
  @Output() flightAccommodationPriceChange: EventEmitter<Money> = new EventEmitter();
  @Output() adultPriceChange: EventEmitter<Money> = new EventEmitter();
  @Output() childrenPriceChange: EventEmitter<Money> = new EventEmitter();

  activeDayIsOpen = false;

  numberOfNights: Number = 3;
  currentAirport: Airport = { name: 'Zürich', value: 'hfVxPrPOE7ct3L3Iy5Eg' } as Airport;

  events: CalendarEvent[];
  flights = [];

  wayOffers: Offer[];
  returnOffers: Offer[];
  roomOffers: Map<Number, Offer>;

  flightOffers: Observable<any[]>;
  accommodationOffers: Observable<any[]>;

  completeOffers: any[];

  viewDate: Date = new Date();
  view = 'month';
  refresh: Subject<any> = new Subject();
  locale = 'de';

  constructor(
    private collectionUtils: CollectionsService,
    protected db: FirestoreService
  ) { }

  ngOnInit() {
    if (this.accummulations['events']['airport']['value'] === this.currentAirport.value &&
      this.accummulations['events']['nights'] === this.numberOfNights &&
      this.accummulations['events']['list'].length > 0) {
      this.events = this.accummulations['events']['list'];

      this.activeDayIsOpen = true;
      this.viewDate = this.accummulations['eventSelected']['start'];
    } else {
      this.updateCalendarEvents();
    }
  }

  updateCalendarEvents() {
    this.accummulations['loading'] = true;

    this.events = [];
    this.flights = [];
    this.wayOffers = [];
    this.returnOffers = [];
    this.roomOffers = new Map();
    this.completeOffers = [];

    console.log('deal,merchant', this.deal.merchant[0].id);

    // TODO: only look at future offers
    this.flightOffers = this.db.colWithIds$('flightOffer');

    this.accommodationOffers = this.db.colWithIds$('accommodationOffer');

    const dealMerchantId = this.deal.merchant[0].id;

    this.findAccommodationOffers(dealMerchantId);

    this.findFlightOffers(dealMerchantId);

    setTimeout(() => {
      this.events = [];
      this.wayOffers.forEach(wayOffer => {
        this.returnOffers.forEach(returnOffer => {
          const differenceInDays = this.differenceInDays(returnOffer.date, wayOffer.date);

          console.log('differenceInDays', differenceInDays, 'numberOfNights', this.numberOfNights);

          if (differenceInDays === this.numberOfNights) {

            console.log('!!We have way and return offers separated by the number of Nights we want!!');

            const fullOffer = {
              'way': wayOffer,
              'return': returnOffer,
              'totalPrice': new Money(0, Currencies.CHF),
              'adultPrice': new Money(0, Currencies.CHF),
              'childrenPrice': new Money(0, Currencies.CHF),
            };

            this.computeFlightOffersTotalPrice(wayOffer, returnOffer, fullOffer);

            this.completeOffers.push(fullOffer);

            if (this.checkIfThereAreRoomOffersInTheInterval(wayOffer.date)) {
              setTimeout(() => {
                console.log('full offer set timeout', fullOffer);
                this.computeRoomOfferTotalPrice(wayOffer.date, fullOffer);

                setTimeout(() => {
                  const totalPrice = fullOffer['totalPrice'];
                  console.log('event total price', totalPrice, fullOffer);

                  const metaStartDate = moment(wayOffer.date);
                  metaStartDate.hour(wayOffer.flightDepartureHour.hours());
                  metaStartDate.minute(wayOffer.flightDepartureHour.minutes());
                  const metaReturnDate = moment(returnOffer.date);
                  metaReturnDate.hour(returnOffer.flightArrivalHour.hours());
                  metaReturnDate.minute(returnOffer.flightArrivalHour.minutes());

                  const event = {
                    title: totalPrice.currency + ' ' + totalPrice.getAmount() / 100,
                    start: moment(wayOffer.date).toDate(),
                    end: moment(wayOffer.date).toDate(),
                    meta: {
                      way: wayOffer,
                      return: returnOffer,
                      totalPriceAmount: totalPrice,
                      adultPrice: fullOffer['adultPrice'],
                      childrenPrice: fullOffer['childrenPrice'],
                      startDate: metaStartDate,
                      returnDate: metaReturnDate
                    }
                  };

                  this.activeDayIsOpen = true;
                  this.viewDate = event.start;

                  console.log('creating event', event);
                  this.events.push(event);
                  console.log('events', this.events);
                  this.triggerChangesOnEventSelection(this.events);

                  this.activeDayIsOpen = true;
                  this.viewDate = this.accummulations['eventSelected']['start'];

                  this.refresh.next();

                  this.accummulations['events'] = {
                    'nights': this.numberOfNights,
                    'airport': this.currentAirport,
                    'list': this.events
                  };

                  this.accummulations['loading'] = false;

                }, 1000);

              }, 1000);
            }
          }

          return;
        });
      });

      console.log('completeOffers', this.completeOffers);
    }, 2000);

  }

  private differenceInDays(returnDate: string, wayDate: string) {
    return moment(returnDate).diff(moment(wayDate), 'days');
  }

  dayClicked({
    date,
    events
  }: {
      date: Date;
      events: Array<CalendarEvent>;
    }): void {
    console.log('day clicked', events, date);
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;

        this.triggerChangesOnEventSelection(events);

        this.accummulations['events'] = {
          'nights': this.numberOfNights,
          'airport': this.currentAirport,
          'list': this.events
        };

      }
    }
  }

  triggerChangesOnEventSelection(events): void {
    if (events.length) {
      const sortedEvents = events.sort((n1, n2) => {
        return n1.meta.totalPriceAmount.amount - n2.meta.totalPriceAmount.amount;
      });

      const event = sortedEvents[0];

      this.hasFlightAccommodation = true;
      this.hasFlightAccommodationChange.emit(this.hasFlightAccommodation);

      this.flightAccommodationPrice = event.meta.totalPriceAmount;
      this.adultPrice = event.meta.adultPrice;
      this.childrenPrice = event.meta.childrenPrice;

      this.flightAccommodationPriceChange.emit(this.flightAccommodationPrice);
      this.adultPriceChange.emit(this.adultPrice);
      this.childrenPriceChange.emit(this.childrenPrice);

      this.accummulations['startDate'] = event.meta.startDate;
      this.accummulations['endDate'] = event.meta.returnDate;

      const differenceInDays = this.differenceInDays(this.accummulations['endDate'], this.accummulations['startDate']);
      this.accummulations['numberOfNights'] = differenceInDays;

      this.accummulations['eventSelected'] = event;

      console.log('accummulations', this.accummulations);
    }
  }

  findAccommodationOffers(dealMerchantId) {
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
  }

  findFlightOffers(dealMerchantId) {
    const dealFlights = this.collectionUtils.getCollection<Flight>(this.deal.flights);
    console.log('deal flights', dealFlights);

    // TODO: read this value from the deal
    const amsterdamAirport = 'JFAnSriEs0g7XS2MlxVk';

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

        let flightFromOffer;

        let isReturn = false;
        this.db.doc$('flight/' + flightOfferFlight.id).subscribe(flight => {
          console.log('flight.origin', flight['origin']);
          if (flight['origin'][0].id === amsterdamAirport && flight['destination'][0].id === this.currentAirport.value) {
            isReturn = true;
          }
          flightFromOffer = flight;
        });

        this.db.colWithIds$<Offer>('flightOffer/' + flightOfferId + '/offers').subscribe(col => {
          console.log('inneroffers: ', col);
          col.forEach(offer => {
            offer['flightOfferId'] = flightOfferId;
            if (isReturn) {
              offer['flightArrivalHour'] = moment(flightFromOffer.arrival);

              this.returnOffers.push(offer);
            } else {
              offer['flightDepartureHour'] = moment(flightFromOffer.departure);

              this.wayOffers.push(offer);
            }

            console.log('inner offer', offer);
          });
          console.log('events', this.events);
          console.log('wayOffers', this.wayOffers);
          console.log('returnOffers', this.returnOffers);
        });

        console.log('wayOffers2', this.wayOffers);
        console.log('returnOffers2', this.returnOffers);

      });

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

  computeRoomOfferTotalPrice(startDate, fullOffer): void {
    for (let index = 0; index < this.numberOfNights; index++) {
      const currentDate = moment(startDate).add(index, 'days').valueOf();
      const roomOffer = this.roomOffers.get(currentDate);

      roomOffer.prices.forEach(element => {
        this.db.doc$<Segment>('accommodationSegment/' + element.ref.id).subscribe(accommodationSegment => {
          if (accommodationSegment.name.en_GB === 'Adult') {
            const adultPrice = new Money(this.accummulations['adults'] * element.amount * 100, Currencies.CHF);

            fullOffer['totalPrice'] = fullOffer['totalPrice'].add(adultPrice);
            fullOffer['adultPrice'] = fullOffer['adultPrice'].add(adultPrice);
            console.log('adult room price for night ', index, adultPrice, fullOffer['totalPrice']);
          } else if (accommodationSegment.name.en_GB === 'Child') {
            const childrenPrice = new Money(this.accummulations['children'] * element.amount * 100, Currencies.CHF);

            fullOffer['totalPrice'] = fullOffer['totalPrice'].add(childrenPrice);
            fullOffer['adultPrice'] = fullOffer['adultPrice'].add(childrenPrice);
            console.log('child room price for night ', index, childrenPrice, fullOffer['totalPrice']);
          }
        });
      });
    }
  }

  computeFlightOffersTotalPrice(offer1, offer2, fullOffer) {
    offer1.prices.forEach(element => {
      this.db.doc$<Segment>('flightSegment/' + element.ref.id).subscribe(flightSegment => {
        if (flightSegment.name.en_GB === 'Adult') {
          const adultPrice = new Money(this.accummulations['adults'] * element.amount * 100, Currencies.CHF);

          fullOffer['totalPrice'] = fullOffer['totalPrice'].add(adultPrice);
          fullOffer['adultPrice'] = fullOffer['adultPrice'].add(adultPrice);
          console.log('adult flight price going ', adultPrice, fullOffer['totalPrice']);
        } else if (flightSegment.name.en_GB === 'Child') {
          const childrenPrice = new Money(this.accummulations['children'] * element.amount * 100, Currencies.CHF);

          fullOffer['totalPrice'] = fullOffer['totalPrice'].add(childrenPrice);
          fullOffer['adultPrice'] = fullOffer['adultPrice'].add(childrenPrice);
          console.log('children flight price going ', childrenPrice, fullOffer['totalPrice']);
        }

      });

    });

    offer2.prices.forEach(element => {
      this.db.doc$<Segment>('flightSegment/' + element.ref.id).subscribe(flightSegment => {
        if (flightSegment.name.en_GB === 'Adult') {
          const adultPrice = new Money(this.accummulations['adults'] * element.amount * 100, Currencies.CHF);

          fullOffer['totalPrice'] = fullOffer['totalPrice'].add(adultPrice);
          fullOffer['adultPrice'] = fullOffer['adultPrice'].add(adultPrice);
          console.log('adult flight price return ', adultPrice, fullOffer['totalPrice']);
        } else if (flightSegment.name.en_GB === 'Child') {
          const childrenPrice = new Money(this.accummulations['children'] * element.amount * 100, Currencies.CHF);

          fullOffer['totalPrice'] = fullOffer['totalPrice'].add(childrenPrice);
          fullOffer['adultPrice'] = fullOffer['adultPrice'].add(childrenPrice);
          console.log('children flight price return ', childrenPrice, fullOffer['totalPrice']);
        }
      });
    });

    if (this.accummulations['bookingFee'].amount > 0) {
      fullOffer['totalPrice'] = fullOffer['totalPrice'].add(this.accummulations['bookingFee']);
    }
  }

  getIds(list: Array<any>) {
    return list.map(item => item.id);
  }

  selectedNightChange(night) {
    console.log('number of nights changed to', night);
    this.numberOfNights = +night;

    this.updateCalendarEvents();
  }

  selectedAirportChange(airport) {
    this.updateCalendarEvents();

    this.currentAirport = airport;
  }
}

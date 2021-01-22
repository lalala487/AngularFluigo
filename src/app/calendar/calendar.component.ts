import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Deal } from '../models/deal';
import { Accummulation } from '../models/fields/accummulation';
import { AngularFirestore } from '@angular/fire/firestore';
import { Airport } from '../models/airport';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { Travel } from '../models/travel';
import { FlightOffer } from '../models/flight-offer';
import { switchMap, map, scan } from 'rxjs/operators';
import { Offer } from '../models/offer';
import { Flight } from '../models/flight';
import moment from 'moment/moment';
import { Money, Currencies } from 'ts-money';
import { AccommodationOffer } from '../models/accommodation-offer';
import { Segment } from '../models/segment';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() deal: Deal;
  @Input() accummulations: Accummulation;

  @Output() flightChosen: EventEmitter<boolean> = new EventEmitter();

  identifier = {};

  activeDayIsOpen = false;

  cheapestEvent: CalendarEvent<Travel>;
  numberOfNights: Number;
  currentAirport: Airport;

  events$: Observable<Array<CalendarEvent<Travel>>>;

  viewDate: Date = new Date();
  view = 'month';
  locale = environment.localeSimple;
  refresh: Subject<any> = new Subject();

  roomOffers = new Map<number, Offer>();

  allOffers = {
    'way': [],
    'return': []
  };

  constructor(
    private db: AngularFirestore,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if (!this.accummulations.event) {
      this.findAsyncEvents();
    } else {
      this.findAsyncEvents(null, null, this.accummulations.event);
    }
  }

  bestPrice() {
    this.cheapestEvent = null;
    this.currentAirport = null;
    this.numberOfNights = null;

    this.findAsyncEvents();
  }

  findAsyncEvents(airport?, night?, currentEvent?) {
    this.identifier = {};

    this.cheapestEvent = null;

    if (!airport) {
      airport = this.currentAirport;
    }

    if (!night) {
      night = this.numberOfNights;
    }

    const areWeFindingCheapestEventOfAll = !airport && !night;

    const dealMerchantId = this.deal.merchant[0].id;

    const flightOffers$ = this.getFlightOffers(dealMerchantId);
    const roomOffers$ = this.getRoomOffers(dealMerchantId);

    const combined$ = combineLatest([flightOffers$, roomOffers$]);

    this.events$ = combined$.pipe(
      scan((events: Array<any>) => {
        console.log('events', events);
        this.allOffers.way.map(wayOffer => {
          this.allOffers.return.map(returnOffer => {

            this.deal.numberOfNights.map(nightNumber => {

              if (!areWeFindingCheapestEventOfAll && nightNumber.id !== night) {
                return;
              }

              nightNumber = nightNumber.id;
              const returnDate = moment(returnOffer.date.toDate());
              const wayDate = moment(wayOffer.date.toDate());

              const differenceInDays = returnDate.diff(wayDate, 'days');
              if (differenceInDays !== nightNumber) {
                return;
              }

              const fullOffer = {
                'way': wayOffer,
                'return': returnOffer,
                'totalPrice': wayOffer.totalPrice.add(returnOffer.totalPrice),
                'adultPrice': wayOffer.adultPrice.add(returnOffer.adultPrice),
                'childrenPrice': wayOffer.childrenPrice.add(returnOffer.childrenPrice),
                'flightAndHotelPrice': wayOffer.totalPrice.add(returnOffer.totalPrice),
              };

              if (this.checkIfThereAreRoomOffersInTheInterval(wayDate.toDate(), nightNumber)) {
                const roomPrice = this.computeRoomOfferTotalPrice(wayDate.toDate(), nightNumber);
                fullOffer['roomOffers'] = roomPrice['roomOffers'];

                fullOffer.adultPrice = fullOffer.adultPrice.add(roomPrice['adultPrice']);
                fullOffer.childrenPrice = fullOffer.childrenPrice.add(roomPrice['childrenPrice']);
                fullOffer.totalPrice = fullOffer.totalPrice.add(roomPrice['totalPrice']);

                fullOffer.flightAndHotelPrice = fullOffer.totalPrice;

                if (this.accummulations.bookingFee) {
                  fullOffer.totalPrice = fullOffer.totalPrice.add(this.accummulations.bookingFee);
                }

                const totalPrice = fullOffer['totalPrice'];
                const metaStartDate = moment(wayOffer.date.toDate());
                metaStartDate.hour(wayOffer.flightDepartureHour.hours());
                metaStartDate.minute(wayOffer.flightDepartureHour.minutes());
                const metaReturnDate = moment(returnOffer.date.toDate());
                metaReturnDate.hour(returnOffer.flightArrivalHour.hours());
                metaReturnDate.minute(returnOffer.flightArrivalHour.minutes());

                const title = totalPrice.currency + ' ' + totalPrice.getAmount() / 100;
                const identifier = title + '-' + wayDate.toString() + '-' + nightNumber + '-' +
                  wayOffer.flight.origin[0].id + '-' + wayOffer.flight.destination[0].id;

                const event = {
                  title: title,
                  start: wayDate.toDate(),
                  end: wayDate.toDate(),
                  meta: {
                    id: identifier,
                    way: wayOffer,
                    return: returnOffer,
                    totalPriceAmount: totalPrice,
                    adultPrice: fullOffer['adultPrice'],
                    childrenPrice: fullOffer['childrenPrice'],
                    startDate: metaStartDate,
                    returnDate: metaReturnDate,
                    numberOfNights: nightNumber,
                    roomOffers: fullOffer['roomOffers'],
                    merchantId: dealMerchantId,
                    flightAndHotelPrice: fullOffer.flightAndHotelPrice
                  } as Travel
                } as CalendarEvent;

                this.refresh.next();

                if (!this.identifier[identifier]) {
                  events.push(event);
                  this.identifier[identifier] = true;
                }
                if (!this.cheapestEvent) {
                  this.cheapestEvent = event;
                  if (!currentEvent) {
                    this.accummulations.event = event;
                  }
                }

                if (event.meta.totalPriceAmount.amount < this.cheapestEvent.meta.totalPriceAmount.amount) {
                  this.cheapestEvent = event;
                  if (!currentEvent) {
                    this.accummulations.event = event;
                  }
                }

                return returnOffer;
              }

            });
          });
          return wayOffer;
        });

        if (!this.cheapestEvent || events.length === 0) {
          this.toastr.error('Das Datum ist nicht korrekt eingefühlt', 'Ehm...');
          return [];
        }

        let filtered;

        if (areWeFindingCheapestEventOfAll) {
          this.activeDayIsOpen = true;

          if (!currentEvent) {
            this.viewDate = this.cheapestEvent.start;
            this.propagateEventInformation(this.cheapestEvent);
          } else {
            this.viewDate = currentEvent.start;
            this.propagateEventInformation(currentEvent);
          }

          filtered = events.filter(event =>
            event.meta.way.flight.origin[0].id === this.currentAirport &&
            event.meta.return.flight.destination[0].id === this.currentAirport &&
            event.meta.numberOfNights === this.numberOfNights
          );
        } else {
          filtered = events.filter(event =>
            event.meta.way.flight.origin[0].id === airport &&
            event.meta.return.flight.destination[0].id === airport &&
            event.meta.numberOfNights === night
          ).sort((event1, event2) => event1.meta.totalPriceAmount - event2.meta.totalPriceAmount);

          if (filtered.length > 0) {
            this.activeDayIsOpen = true;
            const event = filtered[0];
            this.viewDate = event.start;

            this.propagateEventInformation(event);
          }
        }

        return filtered;
      }, [])
    );

  }

  dayClicked({
    events
  }: {
    date: Date;
    events: Array<CalendarEvent>;
  }): void {
    if (!events.length) {
      this.toastr.error('Es gibt kein Angebot an dem Tag', 'Ehm...');
      return;
    }
    const event = events[0];
    this.activeDayIsOpen = true;
    this.viewDate = event.start;

    this.propagateEventInformation(event);
  }

  private propagateEventInformation(event: CalendarEvent<any>) {
    this.currentAirport = event.meta.way.flight.origin[0].id;
    this.numberOfNights = event.meta.numberOfNights;

    this.accummulations.event = event;

    this.accummulations.adultPrice = event.meta.adultPrice;
    this.accummulations.childrenPrice = event.meta.childrenPrice;
    this.accummulations.totalPriceAmount = event.meta.totalPriceAmount;
    this.accummulations.flightAccommodationPrice = event.meta.flightAndHotelPrice;
    this.accummulations.startDate = event.meta.startDate;
    this.accummulations.endDate = event.meta.returnDate;
    this.accummulations.numberOfNights = event.meta.numberOfNights;
    this.accummulations.hasFlightAccommodation = true;

    this.flightChosen.emit(true);
  }

  selectedAirportChange(airport) {
    this.currentAirport = airport;
    this.findAsyncEvents(airport);
  }

  selectedNightChange(night) {
    this.numberOfNights = night;
    this.findAsyncEvents(null, +night);
  }

  private computeRoomOfferTotalPrice(startDate: moment.MomentInput, nightNumber: number): any {
    const toReturn = {
      'totalPrice': new Money(0, Currencies.CHF),
      'adultPrice': new Money(0, Currencies.CHF),
      'childrenPrice': new Money(0, Currencies.CHF),
      'roomOffers': []
    };

    for (let index = 0; index < nightNumber; index++) {
      const currentDate = moment(startDate).add(index, 'days').toDate().getTime();
      const roomOffer = this.roomOffers.get(currentDate);

      toReturn.roomOffers.push(roomOffer);

      toReturn.adultPrice = toReturn.adultPrice.add(roomOffer['adultPrice']);

      if (this.accummulations.children) {
        toReturn.childrenPrice = toReturn.childrenPrice.add(roomOffer['childrenPrice']);
      }
    }

    toReturn.totalPrice = toReturn.totalPrice.add(toReturn.adultPrice).add(toReturn.childrenPrice);

    return toReturn;
  }

  private checkIfThereAreRoomOffersInTheInterval(startDate: moment.MomentInput, numberOfNights: number): boolean {
    for (let index = 0; index < numberOfNights; index++) {
      const currentDate = moment(startDate).add(index, 'days').toDate().getTime();

      if (!this.roomOffers.has(currentDate)) {
        return false;
      }
    }

    return true;
  }

  private getFlightOffers(dealMerchantId: string) {
    this.allOffers = {
      'way': [],
      'return': []
    };

    const flightOfferCollectionRef = this.db.collection<FlightOffer>('flightOffer');

    return flightOfferCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FlightOffer;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).pipe(
      switchMap(flightOffers => {
        const arrivalAirportId = this.deal.arrivalAirport.id;

        const dealFlightIds = this.deal.flights.map(dealFlight => dealFlight.id);

        const offers$ = flightOffers.filter((flightOffer: FlightOffer) => {
          if (!flightOffer.flight) {
            return false;
          }

          if (!flightOffer.merchant) {
            return false;
          }

          const flightOfferFlight = flightOffer.flight[0];
          // (offer flight must be part of the list of flights of the deal)
          if (!dealFlightIds.includes(flightOfferFlight.id)) {
            return false;
          }

          // merchant of the flight offer must be the same as the one of the deal
          if (dealMerchantId !== flightOffer.merchant[0].id) {
            return false;
          }

          return true;
        }).map((flightOffer: FlightOffer) => {
          const flightOfferId = flightOffer.id;

          const flightOfferFlight = flightOffer.flight[0];

          let isReturn = false;
          return this.db.doc<Flight>('flight/' + flightOfferFlight.id).valueChanges().pipe(
            switchMap((flight: Flight) => {

              const off$ = this.deal.departureAirports.map(airportRef => {
                const currentAirportId = airportRef.id;

                let flightFromOffer;
                if (flight['origin'][0].id === arrivalAirportId && flight['destination'][0].id === currentAirportId) {
                  isReturn = true;
                } else if (flight['origin'][0].id === currentAirportId && flight['destination'][0].id === arrivalAirportId) {
                  isReturn = false;
                } else {
                  return of(airportRef);
                }
                flightFromOffer = flight;

                const flightOffers$ = this.db.collection<Offer>(
                  'flightOffer/' + flightOfferId + '/offers',
                  ref => ref.where('date', '>', new Date())
                ).snapshotChanges().pipe(
                  map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Offer;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  }))
                ).pipe(
                  map(offers => {
                    const innerOffers$ = [];
                    offers.filter(offer => offer.stock > 0).map(offer => {
                      offer['flight'] = flightFromOffer;
                      offer['flightOfferId'] = flightOfferId;

                      if (!offer['totalPrice']) {
                        offer['totalPrice'] = new Money(0, Currencies.CHF);
                      }
                      if (!offer['adultPrice']) {
                        offer['adultPrice'] = new Money(0, Currencies.CHF);
                      }
                      if (!offer['childrenPrice']) {
                        offer['childrenPrice'] = new Money(0, Currencies.CHF);
                      }

                      offer.prices.map(element => {
                        const segment$ = this.db.doc<Segment>('flightSegment/' + element.ref.id).valueChanges().pipe(
                          map(flightSegment => {
                            if (flightSegment.name.en_GB === 'Adult') {
                              const adultPrice = new Money(
                                this.accummulations['adults'] * element.amount * 100, Currencies.CHF
                              );

                              offer['totalPrice'] = offer['totalPrice'].add(adultPrice);
                              offer['adultPrice'] = offer['adultPrice'].add(adultPrice);
                            } else if (flightSegment.name.en_GB === 'Child') {
                              const childrenPrice = new Money(
                                this.accummulations['children'] * element.amount * 100, Currencies.CHF
                              );

                              offer['totalPrice'] = offer['totalPrice'].add(childrenPrice);
                              offer['childrenPrice'] = offer['childrenPrice'].add(childrenPrice);
                            }

                            return flightSegment;
                          })
                        );
                        innerOffers$.push(segment$);
                      });

                      if (isReturn) {
                        offer['flightArrivalHour'] = moment(flightFromOffer.arrival);
                        this.allOffers.return.push(offer);
                      } else {
                        offer['flightDepartureHour'] = moment(flightFromOffer.departure);
                        this.allOffers.way.push(offer);
                      }
                      // return offer;
                    });

                    return combineLatest(innerOffers$);
                  })
                );

                return combineLatest([flightOffers$]);
              });

              return combineLatest(off$);

            })
          );

        });

        return combineLatest(offers$);
      })
    );
  }

  private getRoomOffers(dealMerchantId: any) {
    const accommodationOfferCollectionRef = this.db.collection<AccommodationOffer>('accommodationOffer');

    return accommodationOfferCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as AccommodationOffer;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).pipe(
      switchMap(accommodationOffers => {
        const offers$ = accommodationOffers.filter(accommodationOffer => {
          if (!accommodationOffer.merchant) {
            return false;
          }

          // merchant of the accommodationOffer offer must be the same as the one of the deal
          if (dealMerchantId !== accommodationOffer.merchant[0].id) {
            return false;
          }

          return true;
        }).map(accommodationOffer => {
          const accommodationOfferId = accommodationOffer.id;

          const accOffers$ = this.db.collection<Offer>('accommodationOffer/' + accommodationOfferId + '/offers',
            ref => ref.where('date', '>', new Date())
          ).snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Offer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          ).pipe(
            switchMap(offers => {

              const innerOffers$ = [];

              offers.map(roomOffer => {
                roomOffer['accommodationOfferId'] = accommodationOfferId;

                if (!roomOffer['adultPrice']) {
                  roomOffer['adultPrice'] = new Money(0, Currencies.CHF);
                }
                if (!roomOffer['childrenPrice']) {
                  roomOffer['childrenPrice'] = new Money(0, Currencies.CHF);
                }

                roomOffer.prices.map(element => {
                  const segment$ = this.db.doc<Segment>('accommodationSegment/' + element.ref.id).valueChanges().pipe(
                    map(accommodationSegment => {
                      if (accommodationSegment.name.en_GB === 'Adult') {
                        // TODO: need to consider when there are more than 2 people, how to multiply
                        const adultPrice = new Money(
                          element.amount * 100, Currencies.CHF
                        );
                        // .multiply(this.accummulations.adults);

                        roomOffer['adultPrice'] = roomOffer['adultPrice'].add(adultPrice);
                      } else if (accommodationSegment.name.en_GB === 'Child') {
                        // TODO: need to consider when there are more than 2 people, how to multiply
                        const childrenPrice = new Money(
                          element.amount * 100, Currencies.CHF
                        );
                        // .multiply(this.accummulations.children);

                        roomOffer['childrenPrice'] = roomOffer['childrenPrice'].add(childrenPrice);
                      }
                      this.roomOffers.set(roomOffer.date.toDate().getTime(), roomOffer);

                      return accommodationSegment;
                    })
                  );

                  innerOffers$.push(segment$);

                });
              });

              return combineLatest(innerOffers$);

            }));

          return combineLatest([accOffers$]);
        });

        return combineLatest(offers$);
      })
    );
  }


}

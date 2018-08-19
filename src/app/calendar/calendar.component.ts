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

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [CollectionsService]
})
export class CalendarComponent implements OnInit {
  @Input() deal: Deal;
  events: CalendarEvent[] = [];
  flights = [];

  flightOffers: Observable<any[]>;

  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();

  constructor(
    private collectionUtils: CollectionsService,
    protected db: FirestoreService
  ) { }

  ngOnInit() {
    const dealFlights = this.collectionUtils.getCollection<Flight>(this.deal.flights);
    console.log('deal flights', dealFlights);

    this.flightOffers = this.db.colWithIds$('flightOffer');

    // TODO: filter flightOffers by Merchant and Flight
    // (flight must be part of the list of flights of the deal)
    // merchant of the flight offer must be the same as the one of the deal

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

        if (!dealFlightIds.includes(flightOffer.flight[0].id)) {
          return;
        }

        console.log('dealFlightIds', dealFlightIds);

        // TODO: this logic by age segment doesn't make sense,
        // I should sum the price for each of the segments needed from the previous choice
        this.db.colWithIds$('flightOffer/' + flightOfferId + '/offers').subscribe(col => {
        console.log('inneroffers: ', col);
          col.forEach(offer => {
            console.log('inner offer', offer);
            this.events.push({
              title: offer.prices[0].amount + ' ' + flightOffer.currency,
              start: startOfDay(offer.date),
              end: endOfDay(offer.date),
            });
            console.log('events', this.events);
            this.refresh.next();
          });
        });

      });
    });
  }

  getIds(list: Array<any>) {
    return list.map( item => item.id);
  }
}

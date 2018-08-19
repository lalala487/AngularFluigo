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

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [CollectionsService]
})
export class CalendarComponent implements OnInit {
  @Input() deal;
  events: CalendarEvent[] = [];

  flightOffers: Observable<any[]>;

  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();

  constructor(
    private collectionUtils: CollectionsService,
    protected db: FirestoreService
  ) { }

  ngOnInit() {
    this.flightOffers = this.db.colWithIds$('flightOffer');

    // TODO: filter flightOffers by Merchant and Flight
    // (flight must be part of the list of flights of the deal)

    this.flightOffers.subscribe(collection => {
      collection.forEach(flightOffer => {
        console.log('offer: ', flightOffer);

        const flightOfferId = flightOffer.id;
        console.log('offerId: ', flightOfferId);

        this.db.colWithIds$('flightOffer/' + flightOfferId + '/offers').subscribe(col => {
        console.log('inneroffers: ', col);
          col.forEach(offer => {
            console.log('flight offer', offer);
            this.events.push({
              title: offer.date,
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

}

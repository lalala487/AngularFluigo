import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Activity } from '../models/activity';
import * as moment from 'moment';
import { Offer } from '../models/offer';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Money, Currencies } from 'ts-money';
import { Segment } from '../models/segment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activity-date',
  templateUrl: './activity-date.component.html',
  styleUrls: ['./activity-date.component.css']
})
export class ActivityDateComponent implements OnInit {
  @Input() activity: Activity;
  @Input() adults: number;
  @Input() children: number;
  @Input() startDate: moment.Moment;
  @Input() endDate: moment.Moment;
  @Input() selectedOffer: Offer;

  @Output() selectedActivityOfferChange: EventEmitter<Offer> = new EventEmitter();

  locale = environment.localeSimple;


  offers$: Observable<Offer[]>;

  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.offers$ = this.db.collection<Offer>(
      'activityOffer/' + this.activity.activityOfferId + '/offers',
      ref => ref.where('active', '==', true).
        where('date', '>', this.startDate.toDate()).
        where('date', '<=', this.endDate.toDate())
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Offer;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).pipe(
      map(offers => {
        return offers.map(offer => {
          offer.price = new Money(0, Currencies.CHF);

          offer.prices.map(element => {
            this.db.doc<Segment>('activitySegment/' + element.ref.id).valueChanges().pipe(
              map(activitySegment => {
                if (activitySegment.name.en_GB === 'Adults') {
                  offer.price = offer.price.add(new Money(this.adults * element.amount * 100, Currencies.CHF));
                }

                if (activitySegment.name.en_GB === 'Children') {
                  offer.price = offer.price.add(new Money(this.children * element.amount * 100, Currencies.CHF));
                }

                return activitySegment;
              })
            ).subscribe(a => {
              // select first offer by default
              if (!this.selectedOffer) {
                this.chooseOffer(offers[0]);
              }
            });
          });

          return offer;
        });
      }));
  }

  chooseOffer(offer: Offer) {
    this.selectedOffer = offer;

    this.selectedActivityOfferChange.emit(this.selectedOffer);
  }


}

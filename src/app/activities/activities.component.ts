import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Deal } from '../models/deal';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { map, switchMap } from 'rxjs/operators';
import { ActivityOffer } from '../models/activity-offer';
import { Offer } from '../models/offer';
import moment from 'moment/moment';
import { City } from '../models/city';
import { ActivityPack } from '../models/activity-pack';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  @Input() deal: Deal;
  @Input() city: City;
  @Input() startDate: moment.Moment;
  @Input() endDate: moment.Moment;
  @Input() currentActivities: Map<string, ActivityPack>;

  @Output() selectedActivityChange: EventEmitter<Activity> = new EventEmitter();

  activities: Array<Observable<Activity>> = [];
  activityOffers: Array<string> = [];

  doWeHaveActivities = false;

  showNoActivities = false;

  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit() {

    const dealActivitiesIds = this.deal.activities.map(activity => activity.id);

    if (dealActivitiesIds === 0) {
      this.showNoActivities = true;
      return;
    }

    const activityOfferCollectionRef = this.db.collection<ActivityOffer>(
      'activityOffer',
      ref => ref.where('active', '==', true)
    );

    activityOfferCollectionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ActivityOffer;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).pipe(
      switchMap(activityOffers => {
        if (!activityOffers) {
          this.showNoActivities = true;
          return;
        }

        return activityOffers.filter(activityOffer => {
          if (!dealActivitiesIds.includes(activityOffer.activity[0].id)) {
            return false;
          }

          this.db.collection<Offer>(
            'activityOffer/' + activityOffer.id + '/offers',
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
            switchMap(offers => {
              for (let index = 0; index < offers.length; index++) {
                const element = offers[index];

                if (element.stock > 0) {
                  this.activities.push(this.db.doc<Activity>(activityOffer.activity[0].path).valueChanges().pipe(
                    map(activity => {
                      activity.activityOfferId = activityOffer.id;
                      activity.id = activityOffer.activity[0].id;

                      this.doWeHaveActivities = true;

                      if (this.currentActivities.has(activity.id)) {
                        activity.selected = this.currentActivities.get(activity.id).activity.selected;
                      } else {
                        activity.selected = false;
                      }

                      return activity;
                    })
                  ));
                  return offers;
                }
              }
              return offers;
            })).subscribe(a => a);
        });

      })).subscribe(s => s);


      setTimeout(() => {
        if (!this.doWeHaveActivities) {
          this.showNoActivities = true;
        }
      }, 1500);
  }

  activitySelected(activity: Activity) {
    this.selectedActivityChange.emit(activity);
  }

}

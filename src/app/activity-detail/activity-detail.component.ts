import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Activity } from '../models/activity';
import { SafeStyle } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ImageService } from '../services/image.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { ActivityOffer } from '../models/activity-offer';
import { Offer } from '../models/offer';
import { Language } from '../models/language';
import { Money, Currencies } from 'ts-money';
import { Observable } from 'rxjs';
import moment from 'moment/moment';
import { Segment } from '../models/segment';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  @Input() activity: Activity;
  @Input() adults: number;
  @Input() children: number;
  @Input() startDate: moment.Moment;
  @Input() endDate: moment.Moment;
  @Output() moveToDateSelectionEvent: EventEmitter<boolean> = new EventEmitter();

  activityOffer: ActivityOffer;

  imageUrl: SafeStyle;
  locale = environment.locale;

  price: Money = new Money(0, Currencies.CHF);

  languageList: Array<Observable<Language>> = [];

  constructor(
    private imageService: ImageService,
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    const image = this.activity ? this.activity.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => this.imageUrl = this.imageService.sanitizeImage(url)
      );
    }

    this.calculatePrice(this.activity.activityOfferId);

    const list = this.activity.audioGuideLanguages.map(language => {
      return this.db.doc<Language>(language.path).valueChanges();
    });
    this.languageList = list;
  }

  calculatePrice(offerId) {
    this.db.collection<Offer>(
      'activityOffer/' + offerId + '/offers',
      ref => ref.where('active', '==', true).
      where('date', '>', this.startDate.toDate()).
      where('date', '<=', this.endDate.toDate()).limit(1)
    ).valueChanges().pipe(
      switchMap(offers => {
        const offer = offers[0];
        return offer.prices.map(element => {
          this.db.doc<Segment>('activitySegment/' + element.ref.id).valueChanges().pipe(
            map(activitySegment => {
              if (activitySegment.name.en_GB === 'Adults') {
                this.price = this.price.add(new Money(this.adults * element.amount * 100, Currencies.CHF));
              }

              if (activitySegment.name.en_GB === 'Children') {
                this.price = this.price.add(new Money(this.children * element.amount * 100, Currencies.CHF));
              }

              return activitySegment;
            })
          ).subscribe(a => a);
        }
        );

      })).subscribe(a => a);
  }

  moveToDateSelection() {
    this.moveToDateSelectionEvent.emit(true);
  }
}

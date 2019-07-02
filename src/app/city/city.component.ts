import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { City } from '../models/city';
import { SafeStyle } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Interest } from '../models/interest';
import { AngularFirestore } from '@angular/fire/firestore';
import { Activity } from '../models/activity';
import { switchMap, map } from 'rxjs/operators';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnChanges {
  @Input() city: City;
  @Input() imageUrl: SafeStyle;

  activityList: Array<Observable<Activity>> = [];

  interestList: Array<Observable<Interest>> = [];

  locale = environment.locale;

  constructor(
    private db: AngularFirestore,
    private imageService: ImageService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const city: SimpleChange = changes.city;

    if (city) {
      this.city = city.currentValue as City;

      if (!this.city) {
        return;
      }

      if (!this.city.interests) {
        return;
      }

      const list = this.city.interests.map(interest => {
        return this.db.doc<Interest>(interest.path).valueChanges();
        });
      this.interestList = list;

      this.activityList = this.city.activities.map(activity => {
        return this.db.doc<Activity>(activity.path).valueChanges().pipe(map(act => {
          act.imageUrl = this.imageService.getImageDownloadSanitizedStyle$(act.image.main);
          return act;
        }));
      });

    }
  }
}

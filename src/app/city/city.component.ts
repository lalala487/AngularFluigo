import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { City } from '../models/city';
import { SafeStyle } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Interest } from '../models/interest';
import { AngularFirestore } from '@angular/fire/firestore';
import { Activity } from '../models/activity';
import { map } from 'rxjs/operators';
import { ImageService } from '../services/image.service';
import { Question } from '../models/question';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnChanges {
  @Input() city: City;
  @Input() imageUrl: SafeStyle;

  maxNumberOfQuestions = 2;

  activityList: Array<Observable<Activity>> = [];
  interestList: Array<Observable<Interest>> = [];
  questionList: Array<Observable<Question>> = [];

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

      this.interestList = this.city.interests.map(interest => {
        return this.db.doc<Interest>(interest.path).valueChanges();
      });

      this.questionList = this.city.questions.slice(0, this.maxNumberOfQuestions).map(question => {
        return this.db.doc<Question>(question.path).valueChanges().pipe(map( act => {
          act.imageUrl = this.imageService.getImageDownloadSanitizedStyle$(act.image.main);
          return act;
        }));
      });

      this.activityList = this.city.activities.map(activity => {
        return this.db.doc<Activity>(activity.path).valueChanges().pipe(map(act => {
          act.imageUrl = this.imageService.getImageDownloadSanitizedStyle$(act.image.main);
          return act;
        }));
      });

    }
  }
}

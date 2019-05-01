import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { City } from '../models/city';
import { SafeStyle } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Interest } from '../models/interest';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnChanges {
  @Input() city: City;
  @Input() imageUrl: SafeStyle;

  interestList: Array<Observable<Interest>> = [];

  locale = environment.locale;

  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const city: SimpleChange = changes.city;

    if (city) {
      this.city = city.currentValue as City;

      if (!this.city) {
        return;
      }

      const list = this.city.interests.map(interest => {
        return this.db.doc<Interest>(interest.path).valueChanges();
        });
      this.interestList = list;
    }
  }
}

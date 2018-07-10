import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '../services/firestore.service';

import * as moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  deals: Observable<any[]>;

  maxDiscount = 0;

  constructor(protected db: FirestoreService) {
  }

  ngOnInit() {
    const twoWeeksFromNow = moment().add(14, 'days').toDate();

    this.deals = this.db.col$(
      'deal', ref => ref
        .where('endDate', '>', new Date())
        .where('endDate', '<', twoWeeksFromNow)
    );

    this.db.col$(
      'deal', ref => ref
        .where('endDate', '>', new Date())
        .where('endDate', '<', twoWeeksFromNow)
        .orderBy('endDate', 'desc')
        .orderBy('marketingDiscount', 'desc')
        .limit(1)
    ).subscribe(collection => {
      const deal = collection.pop() as Deal;
      this.maxDiscount = deal.marketingDiscount;
    });
  }

}

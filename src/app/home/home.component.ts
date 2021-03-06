import { Component, OnInit } from '@angular/core';

import moment from 'moment/moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Deal } from '../models/deal';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  maxDiscount = 0;

  deals: Observable<Deal[]>;

  isOffline;

  constructor(
    private db: AngularFirestore,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.isOffline = window.localStorage.getItem('isOffline');

    const twoWeeksFromNow = moment().add(14, 'days').toDate();

    this.deals = this.db.collection<Deal>(
      'deal', ref => ref
        .where('endDate', '>', new Date())
        .where('endDate', '<', twoWeeksFromNow)
    ).valueChanges().pipe(
      map(deals => deals.filter(deal => {
         return deal.active;
      }))
    );

    this.deals.subscribe(collection => {
      if (collection.length > 0) {
        this.maxDiscount = this.findMaxDiscount(collection);
      }
    });
  }

  private findMaxDiscount(listOfDeals: Array<Deal>): number {
    listOfDeals.sort((a, b) => b.marketing.discount - a.marketing.discount);

    const deal = listOfDeals[0] as Deal;
    return deal.marketing.discount;
  }
}

import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Deal } from '../models/deal';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  maxDiscount = 0;

  deals: Observable<Deal[]>;

  constructor(
    private db: AngularFirestore,
    public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    const twoWeeksFromNow = moment().add(14, 'days').toDate();

    console.log('twoWeeksFromNow', twoWeeksFromNow);

    this.deals = this.db.collection<Deal>(
      'deal', ref => ref
        .where('endDate', '>', new Date())
        .where('endDate', '<', twoWeeksFromNow)
    ).valueChanges();

    this.deals.subscribe(collection => {
      this.maxDiscount = this.findMaxDiscount(collection);
    });
  }

  private findMaxDiscount(listOfDeals: Array<Deal>): number {
    listOfDeals.sort((a, b) => b.marketing.discount - a.marketing.discount);

    const deal = listOfDeals[0] as Deal;
    return deal.marketing.discount;
  }
}

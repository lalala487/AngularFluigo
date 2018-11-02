import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '../services/firestore.service';

import * as moment from 'moment';
import { Deal } from '../models/deal';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  deals: Observable<any[]>;

  maxDiscount = 0;

  constructor(
    protected db: FirestoreService,
  ) {
  }

  ngOnInit() {
    const twoWeeksFromNow = moment().add(14, 'days').toDate();

    this.deals = this.db.col$(
      'deal', ref => ref
        .where('endDate', '>', new Date())
        .where('endDate', '<', twoWeeksFromNow)
    );

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

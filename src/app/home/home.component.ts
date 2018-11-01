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
  user: Observable<any>;
  email: string;
  emailSent = false;
  isLoggedIn = false;

  deals: Observable<any[]>;

  maxDiscount = 0;

  constructor(
    protected db: FirestoreService,
    protected angularFireAuth: AngularFireAuth,
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    public auth: AuthService
    ) {
  }

  ngOnInit() {
    this.user = this.angularFireAuth.authState;
    const url = this.router.url;

    const twoWeeksFromNow = moment().add(14, 'days').toDate();

    this.deals = this.db.col$(
      'deal', ref => ref
        .where('endDate', '>', new Date())
        .where('endDate', '<', twoWeeksFromNow)
    );


    this.deals.subscribe(collection => {
      this.maxDiscount = this.findMaxDiscount(collection);
    });

    this.auth.isAuthenticated().subscribe(
      loginStatus => {
        this.isLoggedIn = loginStatus;
        if (!loginStatus) {
          this.ngxSmartModalService.open('loginModal');
          this.confirmSignIn(url);
        }
      }
    );
  }

  private findMaxDiscount(listOfDeals: Array<Deal>): number {
    listOfDeals.sort((a, b) => b.marketing.discount - a.marketing.discount);

    const deal = listOfDeals[0] as Deal;
    return deal.marketing.discount;
  }

  async sendEmailLink() {
    try {
      await this.angularFireAuth.auth.sendSignInLinkToEmail(
        this.email,
        environment.passwordlessAuthSettings
      );

      window.localStorage.setItem('emailForSignIn', this.email);

      this.emailSent = true;

    } catch (error) {
      console.log('error', error);
    }
  }


  async confirmSignIn(url) {
    try {
      if (this.angularFireAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');
        console.log('email', email);

        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        // Signin user and remove the email localStorage
        const result = await this.angularFireAuth.auth.signInWithEmailLink(email, url);
        console.log('result', result);
        window.localStorage.removeItem('emailForSignIn');

        this.ngxSmartModalService.close('loginModal');
      }
    } catch (error) {
      console.log('error', error);
    }
  }
}

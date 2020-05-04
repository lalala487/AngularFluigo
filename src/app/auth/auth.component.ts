import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { firestore } from 'firebase';
import moment from 'moment/moment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string;

  isLoggedIn = false;
  emailSent = false;

  endDate: firestore.Timestamp;

  @Input() showContentLanding = false;

  @Output() isLoggedInChange: EventEmitter<boolean> = new EventEmitter();
  @Output() emailSentChanged: EventEmitter<boolean> = new EventEmitter();


  constructor(
    protected angularFireAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    const date = moment('2020-03-26').toDate();

    this.endDate = firestore.Timestamp.fromDate(date);

    this.angularFireAuth.authState.subscribe(user => {
      const loginStatus: boolean = user && user.uid !== undefined;

    this.isLoggedInChange.emit(loginStatus);

    });
  }

  async sendEmailLink() {
    try {
      await this.angularFireAuth.sendSignInLinkToEmail(
        this.email,
        environment.passwordlessAuthSettings
      );

      const url = this.router.url;
      window.localStorage.setItem('emailForSignIn', this.email);
      window.localStorage.setItem('redirectUrl', url);

      this.emailSent = true;

      this.emailSentChanged.emit(true);

    } catch (error) {
      this.toastr.error('Versuche es bitte nochmal', 'Ehm...');
      console.log('error', error);
    }
  }

}

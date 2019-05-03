import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string;

  isLoggedIn = false;
  emailSent = false;

  @Output() isLoggedInChange: EventEmitter<boolean> = new EventEmitter();
  @Output() emailSentChanged: EventEmitter<boolean> = new EventEmitter();


  constructor(
    protected angularFireAuth: AngularFireAuth,
    private router: Router,
  ) { }

  ngOnInit() {
    this.angularFireAuth.authState.subscribe(user => {
      const loginStatus: boolean = user && user.uid !== undefined;

      this.isLoggedInChange.emit(loginStatus);
    });
  }

  async sendEmailLink() {
    try {
      await this.angularFireAuth.auth.sendSignInLinkToEmail(
        this.email,
        environment.passwordlessAuthSettings
      );

      const url = this.router.url;
      console.log('url', url);
      window.localStorage.setItem('emailForSignIn', this.email);
      window.localStorage.setItem('redirectUrl', url);

      this.emailSent = true;

      console.log('emitting email sent');
      this.emailSentChanged.emit(true);

    } catch (error) {
      console.log('error', error);
    }
  }

}

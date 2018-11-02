import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  user: Observable<any>;
  email: string;
  isLoggedIn = false;

  @Output() isLoggedInChange: EventEmitter<boolean> = new EventEmitter();

  emailSent = false;

  constructor(
    protected angularFireAuth: AngularFireAuth,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.angularFireAuth.authState;

    const url = this.router.url;
    console.log('url', url);
    this.auth.isAuthenticated().subscribe(
      loginStatus => {
        this.isLoggedIn = loginStatus;
        console.log('loginStatus', loginStatus);
        if (!loginStatus) {
          this.isLoggedInChange.emit(false);
          this.confirmSignIn(url);
        } else {
          this.isLoggedInChange.emit(true);
        }
      }
    );
  }

  async sendEmailLink() {
    try {
      await this.angularFireAuth.auth.sendSignInLinkToEmail(
        this.email,
        environment.passwordlessAuthSettings
      );

      window.localStorage.setItem('emailForSignIn', this.email);

      this.emailSent = true;

      // TODO: emit email sent
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

        // this.ngxSmartModalService.close('loginModal');
        // TODO: emit sign in done
        this.isLoggedInChange.emit(true);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

}

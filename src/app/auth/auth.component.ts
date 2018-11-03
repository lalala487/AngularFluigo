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
  emailSent = false;

  @Output() isLoggedInChange: EventEmitter<boolean> = new EventEmitter();
  @Output() emailSentChanged: EventEmitter<boolean> = new EventEmitter();


  constructor(
    protected angularFireAuth: AngularFireAuth,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.angularFireAuth.authState;

    this.auth.isAuthenticated().subscribe(
      loginStatus => {
        this.isLoggedIn = loginStatus;
        console.log('loginStatus', loginStatus);
        if (!loginStatus) {
          this.isLoggedInChange.emit(false);
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

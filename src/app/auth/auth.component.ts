import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  email: string;

  isLoggedIn = false;
  emailSent = false;

  @Input() showTitle = true;

  @Output() isLoggedInChange: EventEmitter<boolean> = new EventEmitter();
  @Output() emailSentChanged: EventEmitter<boolean> = new EventEmitter();


  constructor(
    protected angularFireAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
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
      window.localStorage.setItem('emailForSignIn', this.email);
      window.localStorage.setItem('redirectUrl', url);

      this.emailSent = true;

      this.emailSentChanged.emit(true);

    } catch (error) {
      this.toastr.error('Coult not send auth email, please try again');
    }
  }

}

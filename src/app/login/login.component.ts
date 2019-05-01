import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private readonly defaultRedirectUrl = '/home';

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
    const url = this.router.url;
    this.confirmSignIn(url);
  }

  async confirmSignIn(url: string) {
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

        // Adds or updates user
        const user = result.user;
        const userId = user.uid;
        console.log('adds or updates user', userId);
        const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${userId}`);

        const data = {
          uid: user.uid,
          contact: {
            email: user.email,
          },
          photoURL: user.photoURL
        };
        userRef.set(data, { merge: true });
        console.log('adds or updates users with:', data);

        this.redirect();
      } else {
        console.log('wrong url to signin');

        this.router.navigate([this.defaultRedirectUrl]);
      }

    } catch (error) {
      console.log('error', error);

      this.router.navigate(['/home']);
    }
  }
  private redirect(): void {
    const redirectUrl = window.localStorage.getItem('redirectUrl');
    if (redirectUrl) {
      this.router.navigate([redirectUrl]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}

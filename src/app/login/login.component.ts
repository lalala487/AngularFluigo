import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    protected angularFireAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    const url = this.router.url;
    this.confirmSignIn(url);
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

        // Adds or updates user
        const user = result['user'];
        const userId = result['user']['uid'];
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userId}`);

        const data = {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null
        };
        userRef.set(data, { merge: true });

        this.redirect();
      }
    } catch (error) {
      console.log('error', error);
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

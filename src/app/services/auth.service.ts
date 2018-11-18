import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../models/user';

@Injectable()
export class AuthService {
  public redirectUrl: string;
  private user: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
    ) {
    this.user = afAuth.authState;
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.map(user => user && (user.uid !== undefined));
  }

  getUserIdToken(): Observable<string> {
    return fromPromise(this.afAuth.auth.currentUser.getIdToken());
  }

  getLoggedUser(): Observable<User> {
    return this.afs.doc<User>(`users/${this.afAuth.auth.currentUser.uid}`).valueChanges();
  }

}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.user = afAuth.authState;
  }

  logout () {
    this.afAuth.auth.signOut();
  }

  getUserIdToken(): Observable<string> {
    return from(this.afAuth.auth.currentUser.getIdToken());
  }
}

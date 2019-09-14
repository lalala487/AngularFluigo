import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.user = this.afAuth.auth.currentUser;
  }

  getUserIdToken(): Observable<string> {
    return from(this.afAuth.auth.currentUser.getIdToken());
  }
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
  ) {
  }

  getUserIdToken(): Observable<string> {
    return from(this.afAuth.auth.currentUser.getIdToken());
  }
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { User } from 'firebase';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.user = this.afAuth.user;
  }

  getUserIdToken(): Observable<string> {
    return this.user.pipe(switchMap(user => {
      return user.getIdToken();
    }));
  }
}

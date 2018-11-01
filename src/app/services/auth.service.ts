import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {
  public redirectUrl: string;
  private user: Observable<any>;

  constructor(private afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.map(user => user && (user.uid !== undefined));
  }
}

import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { reduce, take } from 'rxjs/operators';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  canActivate(): Observable<boolean> {
    const result = this.afAuth.user
    .pipe(take(1))
    .pipe(
      reduce((acc: boolean, user: User) => {

        if (user) {
           return true;
        }

        this.router.navigate(['/home']);

        return false;
      }, false)
    );

    return result;
  }
}

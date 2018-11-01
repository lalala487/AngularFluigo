import { Injectable } from '@angular/core';

import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().map(allow => {
      if (allow) {
        return true;
      } else {
        this.authService.redirectUrl = state.url;

        this.router.navigate(['/home']);
        return false;
      }
    }).catch(() => {
      this.authService.redirectUrl = state.url;

      this.router.navigate(['/home']);
      return Observable.of(false);
    });
  }

}

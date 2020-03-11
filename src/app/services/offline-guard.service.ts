import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, reduce } from 'rxjs/operators';
import { User } from '../models/user';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConfig } from '../models/app-config';
import { Config } from 'protractor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfflineGuardService {

  constructor(
    private db: AngularFirestore,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const result = this.db.collection<AppConfig>('config', ref => ref.limit(1)).valueChanges()
      .pipe(take(1))
      .pipe(
        reduce((acc: boolean, configs: AppConfig[]) => {

          // Comment the next part out for local testing

            if (!environment.production) {
              window.localStorage.setItem('isOffline', '0');
              return true;
            }

          //

          if (!configs.length) {
            window.localStorage.setItem('isOffline', '0');
            return true;
          }

          const config = configs[0];
          const currentUrl = state.url;

          if (config.isOffline && !config.exceptions.includes(currentUrl)) {
            window.localStorage.setItem('isOffline', '1');
            if (state.url !== '/' && !currentUrl.startsWith('/login') ) {
              this.router.navigate(['/']);
            }
          } else {
            window.localStorage.setItem('isOffline', '0');
          }

          return true;
        }, false)
      );

    return result;
  }
}

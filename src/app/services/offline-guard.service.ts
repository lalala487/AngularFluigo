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
          if (!environment.production) {
            window.localStorage.setItem('isOffline', '0');
            return true;
          }

          console.log('configs', configs);
          console.log('url', state.url);
          if (!configs.length) {
            window.localStorage.setItem('isOffline', '0');
            return true;
          }

          const config = configs[0];

          if (!config.isOffline) {
            window.localStorage.setItem('isOffline', '0');
          } else {
            window.localStorage.setItem('isOffline', '1');
            if (state.url !== '/home') {
              this.router.navigate(['/home']);
            }
          }

          return true;
        }, false)
      );

    return result;
  }
}

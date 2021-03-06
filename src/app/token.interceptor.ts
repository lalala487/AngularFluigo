import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    auth: AuthService;

    constructor(private inj: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // inject the authservice manually (see https://github.com/angular/angular/issues/18224)
        this.auth = this.inj.get(AuthService);

        // don't inject bearer token if not authenticated
        this.auth.user.subscribe(user => {
            if (!user) {
                return next.handle(request);
            }
        });

        return this.auth.getUserIdToken().pipe(
            switchMap(token => {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next.handle(request);
            })
        );
    }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeCustomerService {
  readonly api = environment.functionsURL;

  constructor(
    private http: HttpClient
  ) { }

  updateStripeContact(newEmail: string) {
    const url = `${this.api}/updateStripeContact`;

    return this.http.post(url, {
      email: newEmail
    });
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable()
export class SendgridService {
  readonly api = environment.functionsURL;

  constructor(
    private http: HttpClient
  ) { }

  updateSendGridContact(contact: User) {
    console.log('updating sendgrid contact', contact);
    const url = `${this.api}/updateSendGridContact`;

    console.log('url', url);

    return this.http.post<User>(url, {});
  }

}

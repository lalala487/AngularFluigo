import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserContact } from '../models/user-contact';

@Injectable({
  providedIn: 'root'
})
export class SendgridService {
  readonly api = environment.functionsURL;

  constructor(
    private http: HttpClient
  ) { }

  updateSendGridContact(email: string, oldEmail?: string) {
    const url = `${this.api}/updateSendGridContact`;

    return this.http.post<UserContact>(url, {
      newEmail: email,
      oldEmail: oldEmail,
    });
  }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  readonly api = environment.functionsURL;

  constructor(
    private http: HttpClient
  ) { }

  chat(message: string): Observable<any> {
    const url = `${this.api}/chatbot`;

    const toSend = {
      'message': message,
    };

    return this.http.post(url, toSend);
  }
}

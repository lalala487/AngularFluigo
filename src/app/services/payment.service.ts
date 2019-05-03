import { Injectable, OnInit } from '@angular/core';
import { StripeService, SourceResult } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { Money } from 'ts-money';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Charge } from '../payment-form/payment-models';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PaymentService implements OnInit {
  readonly api = environment.functionsURL;

  constructor(
    private stripeService: StripeService,
    private http: HttpClient,
    private db: AngularFirestore,
  ) {
  }

  createCharge$(card: any, amount: Money): Observable<any> {
    const url = `${this.api}/charge`;

    return from<SourceResult>(this.stripeService.createSource(card)).pipe(
      switchMap(data => {
        const toSend = {
          'amount': amount.amount,
          'currency': amount.currency,
          'sourceId': data.source.id
        };

        console.log('toSend', toSend);
        return this.http.post<Charge>(url, toSend);
      })
    );

  }

  ngOnInit(): void {
  }

  writePaymentToDb(charge: Charge) {
    const payment = {
      'id': charge.id,
      'charge': charge,
      'amount': charge.amount,
      'currency': charge.currency,
      'customer': charge.customer
    };

    console.log('will write payment to db', payment);

    const payments = this.db.collection('payment');

    return payments.add(payment);
  }
}

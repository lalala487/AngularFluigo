import { Injectable, OnInit } from '@angular/core';
import { StripeService } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
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

  createCharge$(card: any, amount: Money): any {
    const url = `${this.api}/charge`;

    return from(this.stripeService.createSource(card)).pipe(
      switchMap(data => {
        const toSend = {
          'amount': amount.amount,
          'currency': amount.currency,
          'sourceId': data['source'].id
        };

        return this.http.post<Charge>(url, toSend);
      })
    );

  }

  ngOnInit(): void {
  }

  writePaymentToDb(charge: Charge, userId: string) {
    const payment = {
      'id': charge.id,
      'charge': charge,
      'amount': charge.amount,
      'currency': charge.currency,
      'customer': charge.customer,
      'userId': userId
    };

    const payments = this.db.collection('payment');

    return payments.add(payment);
  }
}

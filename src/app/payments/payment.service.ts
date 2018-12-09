import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { FirestoreService } from '../services/firestore.service';
import { Charge, Source } from '../payment-form/models';
import { Money } from 'ts-money';


@Injectable()
export class PaymentService {
  private stripe = Stripe(environment.stripeKey);
  elements: any;

  readonly api = environment.functionsURL;

  constructor(
    protected db: FirestoreService,
    private http: HttpClient
  ) {
    this.elements = this.stripe.elements({ 'locale': 'de' });
  }

  createCharge(card: any, amount: Money): Observable<Charge> {
    const url = `${this.api}/charge`;

    return fromPromise<Source>(this.stripe.createSource(card)).pipe(
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

  writePaymentToDb(charge: Charge) {
    const payment = {
      'id': charge.id,
      'charge': charge,
      'amount': charge.amount,
      'currency': charge.currency,
      'customer': charge.customer
    };

    console.log('will write payment to db', payment);

    return this.db.add('payment', payment);
  }

}

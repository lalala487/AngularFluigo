import { Injectable } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Injectable()
export class PaymentService {

  userId = 123;

  constructor(
    protected db: FirestoreService
  ) { }

  processPayment(token: any, amount: number) {
    const payment = { 'token': token, 'amount': amount, 'userId': this.userId };
    console.log('will write payment to db', payment);
    return this.db.add('payment', payment);
  }

}

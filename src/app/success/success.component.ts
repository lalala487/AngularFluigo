import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { Money } from 'ts-money';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  @Input() accummulations: Object;

  order: Order;

  constructor(
    private db: FirestoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('accummulations', this.accummulations);

    this.authService.getLoggedUser().subscribe(innerUser => {
      this.order = {
        startDate: this.accummulations['startDate'].valueOf(),
        endDate: this.accummulations['endDate'].valueOf(),
        merchantId: this.accummulations['merchantId'],
        userId: innerUser.uid,
        contact: this.accummulations['contact']['email'],
        totalPrice: this.accummulations['totalPriceAmount'].toJSON(),
        payment: this.accummulations['payment']
      } as Order;

      // TODO: decrease stock in accommodation and flightOffers.

      // TODO: add payment id

      this.db.add('order', this.order);
    });

  }

}

interface Order {
  userId: string;
  merchantId: string;
  // accommodations: [];
  // flights: [];
  // activities: [];
  startDate: Date;
  endDate: Date;
  contact: User;
  totalPrice: Money;
}

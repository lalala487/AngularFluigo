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

      const wayOfferId = this.accummulations['eventSelected']['meta']['way']['id'];
      const wayFlightOfferId = this.accummulations['eventSelected']['meta']['way']['flightOfferId'];
      const returnOfferId = this.accummulations['eventSelected']['meta']['return']['id'];
      const returnFlightOfferId = this.accummulations['eventSelected']['meta']['return']['flightOfferId'];

      this.db.doc$('flightOffer/' + wayFlightOfferId + '/offers/' + wayOfferId).take(1).subscribe(offer => {
        console.log('offer', offer);
        offer['stock'] = offer['stock'] - 1;

        this.db.update('flightOffer/' + wayFlightOfferId + '/offers/' + wayOfferId, offer);

        return offer['stock'];

      });

      this.db.doc$('flightOffer/' + returnFlightOfferId + '/offers/' + returnOfferId).take(1).subscribe(offer => {
        console.log('offer', offer);
        offer['stock'] = offer['stock'] - 1;

        this.db.update('flightOffer/' + returnFlightOfferId + '/offers/' + returnOfferId, offer);

        return offer['stock'];
      });

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

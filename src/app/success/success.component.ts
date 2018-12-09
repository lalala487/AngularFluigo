import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { Money } from 'ts-money';
import { SendgridService } from '../services/sendgrid.service';

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
    private authService: AuthService,
    private sendGridService: SendgridService
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

      this.updateContact(innerUser);

      const wayOfferId = this.accummulations['eventSelected']['meta']['way']['id'];
      const wayFlightOfferId = this.accummulations['eventSelected']['meta']['way']['flightOfferId'];
      this.reduceFlightOfferStock(wayFlightOfferId, wayOfferId);

      const returnOfferId = this.accummulations['eventSelected']['meta']['return']['id'];
      const returnFlightOfferId = this.accummulations['eventSelected']['meta']['return']['flightOfferId'];
      this.reduceFlightOfferStock(returnFlightOfferId, returnOfferId);

      this.db.add('order', this.order);
    });

  }

  private reduceFlightOfferStock(flightOfferId: any, offerId: any) {
    this.db.doc$('flightOffer/' + flightOfferId + '/offers/' + offerId).take(1).subscribe(offer => {
      console.log('offer', offer);
      offer['stock'] = offer['stock'] - 1;
      this.db.update('flightOffer/' + flightOfferId + '/offers/' + offerId, offer);
      return offer['stock'];
    });
  }

  private updateContact(innerUser: User) {
    const contact = Object.assign({}, this.accummulations['contact']);
    this.sendGridService.updateSendGridContact(contact).subscribe((data) => {
      console.log('sendgrid response', data);
    });

    this.db.update('users/' + innerUser.uid, { 'contact': contact });

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

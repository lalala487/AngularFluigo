import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Money } from 'ts-money';
import { CalendarEvent } from 'calendar-utils';
import { Accummulation } from '../models/fields/accummulation';
import { SendgridService } from '../services/sendgrid.service';
import { firestore } from 'firebase';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  @Input() event: CalendarEvent;
  @Input() payment: DocumentReference;
  @Input() accummulations: Accummulation;

  order: Order;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private db: AngularFirestore,
    private sendGridService: SendgridService
  ) { }

  ngOnInit() {

    console.log('accummulations', this.accummulations);

    this.angularFireAuth.user.subscribe(innerUser => {

      const event = this.accummulations.event;
      const payment = this.accummulations.payment;

      this.order = {
        startDate: event.meta.startDate.toDate(),
        endDate: event.meta.returnDate.toDate(),
        merchantId: event.meta.merchantId,
        userId: innerUser.uid,
        totalPrice: event.meta.totalPriceAmount.toJSON(),
        payment: payment,
        adults: this.accummulations.adults,
        children: this.accummulations.children,
        contact: this.accummulations.contact,
      } as Order;

      if (this.accummulations.activityOffer) {
        const activityOffer: OrderOffer = {
          stock: this.accummulations.activityOffer.stock,
          date: this.accummulations.activityOffer.date,
          price: this.accummulations.activityOffer.price.toJSON(),
        };

        this.order.activityOffers = [activityOffer];
      }

      const accommodationOffers: OrderOffer[] = this.accummulations.event.meta.roomOffers.map(roomOffer => {
        const price: Money = roomOffer.adultPrice.multiply(this.accummulations.adults);
        price.add(roomOffer.childrenPrice.multiply(this.accummulations.children));

        return {
          stock: roomOffer.stock,
          date: roomOffer.date,
          price: price.toJSON()
        } as OrderOffer;
      });
      this.order.accommodationOffers = accommodationOffers;

      const departureOffer: OrderFlightOffer = {
        stock: this.accummulations.event.meta.way.stock,
        date: this.accummulations.event.meta.way.date,

        price: this.accummulations.event.meta.way['totalPrice'].toJSON(),
        flightNumber: this.accummulations.event.meta.way['flight']['number'],
      };

      const returnOffer: OrderFlightOffer = {
        stock: this.accummulations.event.meta.return.stock,
        date: this.accummulations.event.meta.return.date,

        price: this.accummulations.event.meta.return['totalPrice'].toJSON(),
        flightNumber: this.accummulations.event.meta.return['flight']['number'],
      };

      this.order.flightOffers = {
        returnFlightOffer: returnOffer,
        departureFlightOffer: departureOffer
      };


      console.log('order', this.order);

      this.db.collection('order').add(this.order);

      this.updateContact(innerUser);

      this.reduceOffersStock();

    });
  }

  private reduceOffersStock() {
    const departureOfferId = this.accummulations['event']['meta']['way']['id'];
    const departureFlightOfferId = this.accummulations['event']['meta']['way']['flightOfferId'];
    const wayStock = this.accummulations.event.meta.way.stock;
    this.reduceOfferStock('flightOffer/', departureFlightOfferId, departureOfferId, wayStock);

    const returnOfferId = this.accummulations['event']['meta']['return']['id'];
    const returnFlightOfferId = this.accummulations['event']['meta']['return']['flightOfferId'];
    const returnStock = this.accummulations.event.meta.return.stock;
    this.reduceOfferStock('flightOffer/', returnFlightOfferId, returnOfferId, returnStock);

    if (this.accummulations.activityOffer) {
      this.reduceOfferStock(
        'activityOffer/',
        this.accummulations.activity.activityOfferId,
        this.accummulations.activityOffer.id,
        this.accummulations.activityOffer.stock
      );
    }

    this.accummulations.event.meta.roomOffers.map(roomOffer => {
      this.reduceOfferStock('accommodationOffer/', roomOffer.accommodationOfferId, roomOffer.id, roomOffer.stock);
    });
  }

  private reduceOfferStock(collectionName: string, baseOfferId: string, offerId: string, stock: number) {
    const ref = this.db.doc(
      collectionName + baseOfferId + '/offers/' + offerId
    );

    console.log('decreasing stock to ', stock, 'from ', ref.ref.path);

    ref.set(
      { 'stock': stock - 1 },
      { merge: true }
    );
  }

  private updateContact(innerUser: any) {
    const contact = Object.assign({}, this.accummulations.contact);

    this.sendGridService.updateSendGridContact(contact.email).subscribe((data) => {
      console.log('sendgrid response', data);
    });

    const user = {
      name: {
        first: contact.firstName,
        last: contact.lastName,
      },
      contact: {
        // email: contact.email,
        phone: {
          home: contact.phoneNumber
        }
      }
    };

    this.db.doc('users/' + innerUser.uid).set(user, {merge: true});
  }

}

interface Order {
  userId: string;
  merchantId: string;
  startDate: Date;
  endDate: Date;
  contact: any;
  totalPrice: object;
  payment: DocumentReference;
  activityOffers: OrderOffer[];
  accommodationOffers: OrderOffer[];
  adults: number;
  children: number;
  flightOffers: {
    departureFlightOffer: OrderFlightOffer;
    returnFlightOffer: OrderFlightOffer;
  };
}

export interface OrderOffer {
  stock: number;
  date: firestore.Timestamp;

  price: object;
}

export interface OrderFlightOffer {
  stock: number;
  date: firestore.Timestamp;

  price: object;
  flightNumber: string;
}

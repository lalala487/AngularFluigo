import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Money } from 'ts-money';
import { CalendarEvent } from 'calendar-utils';
import { Accummulation } from '../models/fields/accummulation';
import { SendgridService } from '../services/sendgrid.service';
import { Order, OrderOffer, OrderFlightOffer } from '../models/order';
import { Offer } from '../models/offer';
import { Activity } from '../models/activity';

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
        city: this.accummulations.city,
        accommodation: this.accummulations.accommodation,
        activityOffers: [],
        luggage: this.accummulations.luggage
      } as Order;


      for (const [key, value] of this.accummulations.activities.entries()) {
        const offer: Offer = value.offer;

        const activityOffer: OrderOffer = {
          stock: offer.stock,
          date: offer.date,
          price: offer.price.toJSON(),
        };

        this.order.activityOffers.push(activityOffer);
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

    for (const [activityId, value] of this.accummulations.activities.entries()) {
      const offer: Offer = value.offer;
      const activity: Activity = value.activity;

      this.reduceOfferStock(
        'activityOffer/',
        activity.activityOfferId,
        offer.id,
        offer.stock
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

    ref.set(
      { 'stock': stock - 1 },
      { merge: true }
    );
  }

  private updateContact(innerUser: any) {
    const contact = Object.assign({}, this.accummulations.contact);

    this.sendGridService.updateSendGridContact(contact.email).subscribe((data) => {
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

    this.db.doc('users/' + innerUser.uid).set(user, { merge: true });
  }
}

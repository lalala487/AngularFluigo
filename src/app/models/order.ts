import { DocumentReference } from '@angular/fire/firestore';
import { firestore } from 'firebase';

export interface Order {
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

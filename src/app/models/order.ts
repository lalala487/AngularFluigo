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
  city: DocumentReference;
  accommodation: DocumentReference;
  activityOffers: OrderOffer[];
  accommodationOffers: OrderOffer[];
  adults: number;
  children: number;
  flightOffers: {
    departureFlightOffer: OrderFlightOffer;
    returnFlightOffer: OrderFlightOffer;
  };
}

export interface OrderTimestamps {
  id: string;
  userId: string;
  merchantId: string;
  startDate: firestore.Timestamp;
  endDate: firestore.Timestamp;
  contact: any;
  totalPrice: object;
  payment: DocumentReference;
  city: DocumentReference;
  accommodation: DocumentReference;
  activityOffers: OrderOffer[];
  accommodationOffers: OrderOffer[];
  adults: number;
  children: number;
  flightOffers: {
    departureFlightOffer: OrderFlightOffer;
    returnFlightOffer: OrderFlightOffer;
  };
  documents: {
    accommodation: Array<string>;
    activity: Array<string>;
    flight: Array<string>;
    various: Array<string>;
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

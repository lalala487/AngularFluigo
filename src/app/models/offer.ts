import { firestore } from 'firebase';
import { Money } from 'ts-money';

export interface Offer {
    id: string;

    active: boolean;
    stock: number;
    date: firestore.Timestamp;
    prices: any;
    flightDepartureHour: any;
    flightArrivalHour: any;

    price: Money;
}

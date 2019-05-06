import { Money } from 'ts-money';
import { UserContact } from '../user-contact';
import { Activity } from '../activity';
import { Offer } from '../offer';
import { DocumentReference } from '@angular/fire/firestore';
import { CalendarEvent } from 'calendar-utils';
import { Travel } from '../travel';

export interface Accummulation {
    numberOfNights: number;
    startDate: string;
    endDate: string;
    totalPriceAmount: Money;
    hasFlightAccommodation: boolean;
    flightAccommodationPrice: Money;
    hasTransportation: boolean;
    transportationPrice: Money;
    hasInsurance: boolean;
    insurancePrice: Money;
    adultPrice: Money;
    childrenPrice: Money;
    bookingFee: Money;
    children: number;
    adults: number;
    birthday0: any;
    birthday1: any;
    birthday2: any;
    birthday3: any;
    birthday4: any;
    birthday5: any;
    contact: UserContact;
    event: CalendarEvent<Travel>;
    activity: Activity;
    activityOffer: Offer;
    payed: boolean;
    payment: DocumentReference;
    city: DocumentReference;
    accommodation: DocumentReference;
}

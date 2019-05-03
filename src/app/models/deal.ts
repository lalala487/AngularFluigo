import { MarketingField } from './fields/marketing';
import { DocumentReference } from '@angular/fire/firestore';
import { TranslatableField } from './fields/translatable';
import { AvailableService } from './fields/available-service';
import { firestore } from 'firebase';

export interface Deal {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    slug: string;
    merchant: any;
    ride: any;
    city: any;
    accommodation: any;
    startDate: Date;
    endDate: firestore.Timestamp;
    flights: any;
    activities: any;
    availableServices: AvailableService;
    rating: number;
    marketing: MarketingField;
    bookingFee: number;
    numberOfNights: any;
    arrivalAirport: any;
    departureAirports: Array<DocumentReference>;
}

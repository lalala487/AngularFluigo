import { MarketingField } from './fields/marketing';
import { DocumentReference } from '@angular/fire/firestore';
import { TranslatableField } from './fields/translatable';
import { AvailableService } from './fields/available-service';

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
    endDate: Date;
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

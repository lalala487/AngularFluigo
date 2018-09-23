import { MarketingField } from './fields/marketing';

export interface Deal {
    active: boolean;
    name: object;
    description: object;
    slug: string;
    merchant: any;
    city: any;
    accommodation: any;
    startDate: Date;
    endDate: Date;
    flights: any;
    activities: any;
    availableServices: object;
    rating: number;
    marketing: MarketingField;
}

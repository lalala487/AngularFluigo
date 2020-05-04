import { TranslatableField } from './fields/translatable';

export interface FlightFare {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    airline: any;
    baggage: any;
    cabin: any;
    checked: any;
    dimensions: any;
    weight: any;
    bagOne: any;
    bagTwo: any;
    bagThree: any;
    length: number;
    width: number;
    depth: number;
    maxWeight: number;
    price: number;
}

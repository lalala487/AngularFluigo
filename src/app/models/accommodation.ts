import { TranslatableField } from './fields/translatable';

export interface Accommodation {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    image: Object;
    location: Object;
    address: Object;
    contact: Object;
    amenities: any;
    cities: any;
    segments: any;
}

import { TranslatableField } from './fields/translatable';
import { ImageField } from './fields/image';

export interface Accommodation {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    image: ImageField;
    location: Object;
    address: Object;
    contact: Object;
    amenities: any;
    cities: any;
    segments: any;
}

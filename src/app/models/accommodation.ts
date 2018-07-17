import { TranslatableField } from './fields/translatable';
import { ImageField } from './fields/image';
import { Review } from './review';

export interface Accommodation {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    secrets: TranslatableField;
    image: ImageField;
    location: Object;
    address: Object;
    contact: Object;
    amenities: any;
    cities: any;
    segments: any;
    review: Review;
    featured: any;
    rating: number;
}

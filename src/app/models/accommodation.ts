import { TranslatableField } from './fields/translatable';
import { ImageField } from './fields/image';
import { Review } from './review';
import { DocumentReference } from '@angular/fire/firestore';

export interface Accommodation {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    secrets: TranslatableField;
    overview: TranslatableField;
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
    rooms: DocumentReference[];
}

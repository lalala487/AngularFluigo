import { TranslatableField } from './fields/translatable';
import { ImageField } from './fields/image';
import { Review } from './review';
import { Property } from './property';
import { Grading } from './grading';
import { DocumentReference } from '@angular/fire/firestore';

export interface Accommodation {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    secrets: TranslatableField;
    overview: TranslatableField;
    advice: TranslatableField;
    image: ImageField;
    carouselImage: ImageField;
    location: Object;
    grading: Grading;
    address: Object;
    contact: Object;
    amenities: any;
    cities: any;
    segments: any;
    review: Review;
    property: Property;
    featured: any;
    rating: number;
    rooms: DocumentReference[];
}

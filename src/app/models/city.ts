import { TranslatableField } from './fields/translatable';
import { Review } from './review';

export interface City {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    secrets: TranslatableField;
    image: Object;
    location: Object;
    review: Review;
    featured: any;

}

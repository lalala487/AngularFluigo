import { TranslatableField } from './fields/translatable';
import { Review } from './review';
import { ImageField } from './fields/image';

export interface City {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    secrets: TranslatableField;
    image: ImageField;
    location: Object;
    review: Review;
    interests: any[];
}

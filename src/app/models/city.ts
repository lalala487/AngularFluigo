import { TranslatableField } from './fields/translatable';
import { Review } from './review';
import { CityActivity } from './city-activity';

export interface City {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    secrets: TranslatableField;
    image: Object;
    location: Object;
    review: Review;
    featured: any;
    activity1: CityActivity;
    activity2: CityActivity;
    activity3: CityActivity;
    activity4: CityActivity;
}

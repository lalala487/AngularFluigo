import { TranslatableField } from './fields/translatable';
import { Review } from './review';
import { CityActivity } from './city-activity';
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
    activity1: CityActivity;
    activity2: CityActivity;
    activity3: CityActivity;
    activity4: CityActivity;
}

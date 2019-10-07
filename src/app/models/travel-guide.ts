
import { TranslatableField } from './fields/translatable';
import { HighlightsField } from './fields/highlightsfield';
import { ImageField } from './fields/image';
import { GuideScheduleField } from './guide-schedule-field';
import { SafeStyle } from '@angular/platform-browser';
import { Observable } from 'rxjs';

export interface TravelGuide {
    active: boolean;
    slug: string;
    image: ImageField;
    name: TranslatableField;
    description: TranslatableField;
    highlights: HighlightsField;
    history: ImageTextField;
    culture: ImageTextField;
    schedule: GuideScheduleField;
    restaurants: Array<RestaurantField>;
    cities: any;
    imageUrl: Observable<SafeStyle>;
}

export interface ImageTextField {
    text: TranslatableField;
    image: ImageField;
}

interface RestaurantField {
    name: TranslatableField;
    description: TranslatableField;
    rating: RatingField;
}

interface RatingField {
    rating: number;
}

import { TranslatableField } from './fields/translatable';
import { Review } from './review';
import { ImageField } from './fields/image';
import { SafeStyle } from '@angular/platform-browser';
import { Observable } from 'rxjs';

export interface Activity {
    id: string;
    name: TranslatableField;
    description: TranslatableField;
    overview: TranslatableField;
    image: ImageField;
    services: Array<any>;
    activityOfferId: string;
    rating: number;
    duration: number;
    audioGuideLanguages: any[];
    review: Review;
    advice: TranslatableField;
    imageUrl: Observable<SafeStyle>;

    selected: boolean;
}

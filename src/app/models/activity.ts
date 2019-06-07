import { TranslatableField } from './fields/translatable';

import { ImageField } from './fields/image';

export interface Activity {
    id: string;
    name: TranslatableField;
    description: TranslatableField;
    overview: TranslatableField;
    image: ImageField;
    services: Array<any>;
    activityOfferId: string;
    rating: number;
    audioGuideLanguages: any[];
}

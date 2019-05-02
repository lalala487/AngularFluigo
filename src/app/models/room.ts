import { TranslatableField } from './fields/translatable';

import { ImageField } from './fields/image';
import { BedsField } from './fields/beds';

export interface Room {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    image: ImageField;
    amenities: any;
    accommodation: any;
    beds: BedsField;
}

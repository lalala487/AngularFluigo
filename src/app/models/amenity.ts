import { ImageField } from './fields/image';
import { TranslatableField } from './fields/translatable';

export interface Amenity {
    active: false;
    name: TranslatableField;
    description: TranslatableField;
    id: string;
    image: ImageField;
}

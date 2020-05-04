import { ImageField } from './fields/image';
import { TranslatableField } from './fields/translatable';

export interface Airline {
    background: ImageField;
    logo: ImageField;
    name: TranslatableField;
}

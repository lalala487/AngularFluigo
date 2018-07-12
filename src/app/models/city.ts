import { TranslatableField } from './fields/translatable';

export interface City {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    image: Object;
    location: Object;
}

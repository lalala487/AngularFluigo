import { TranslatableField } from './fields/translatable';

export interface Property {
    style: TranslatableField;
    rooms: number;
    setting: TranslatableField;
    about: TranslatableField;
}

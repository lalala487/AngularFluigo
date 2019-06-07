import { TranslatableField } from './fields/translatable';

export interface Language {
    active: false;
    name: TranslatableField;
    description: TranslatableField;
    id: string;
}

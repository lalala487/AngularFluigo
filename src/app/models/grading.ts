import { TranslatableField } from './fields/translatable';

export interface Grading {
    name: TranslatableField;
    description: TranslatableField;
    rating: number;
}

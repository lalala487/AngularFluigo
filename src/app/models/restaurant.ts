import { TranslatableField } from './fields/translatable';
export interface Restaurant {
    name: TranslatableField;
    description: TranslatableField;
    rating: Rating;
}

interface Rating {
    rating: number;
}

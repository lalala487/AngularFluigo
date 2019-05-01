import { TranslatableField } from './fields/translatable';

export interface Ride {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    currency: string;
    amount: number;
}

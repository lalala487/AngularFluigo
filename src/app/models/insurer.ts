import { TranslatableField } from './fields/translatable';

export interface Insurer {
    active: boolean;
    address: any;
    commission: number;
    contact: any;
    name: TranslatableField;
    description: TranslatableField;
}

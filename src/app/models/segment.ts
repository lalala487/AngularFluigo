import { TranslatableField } from './fields/translatable';

export interface Segment {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
}

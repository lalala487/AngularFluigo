import { TranslatableField } from './fields/translatable';
import { DocumentReference } from '@angular/fire/firestore';

export interface Insurance {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    currency: string;
    amount: number;
    insurer: DocumentReference;
}

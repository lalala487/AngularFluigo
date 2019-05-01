import { ImageField } from './fields/image';
import { TranslatableField } from './fields/translatable';

export interface Interest {
    active: false;
    name: TranslatableField;
    description: TranslatableField;
    id: string;
    image: ImageField;
}

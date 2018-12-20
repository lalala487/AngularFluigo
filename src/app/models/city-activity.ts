import { TranslatableField } from './fields/translatable';
import { ImageField } from './fields/image';

export interface CityActivity {
    activity: TranslatableField;
    name: TranslatableField;
    image: ImageField;
}

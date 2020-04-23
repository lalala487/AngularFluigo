import { TranslatableField } from './fields/translatable';
import { ImageField } from './fields/image';
import { SafeStyle } from '@angular/platform-browser';
import { Observable } from 'rxjs';

export interface Question {
    active: boolean;
    name: TranslatableField;
    description: TranslatableField;
    image: ImageField;
    imageUrl: Observable<SafeStyle>;

    selected: boolean;
}

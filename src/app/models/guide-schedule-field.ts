import { TranslatableField } from './fields/translatable';
import { ImageField } from './fields/image';

export interface GuideScheduleField {
    dayOne: ScheduleDAy;
    dayTwo: ScheduleDAy;
    dayThree: ScheduleDAy;
}

export interface ScheduleDAy {
    name: TranslatableField;
    description: TranslatableField;
    image: ImageField;
}

import { Offer } from './offer';
import { Money } from 'ts-money';

import * as moment from 'moment';

export interface Travel {
    id: string;
    way: Offer;
    return: Offer;
    totalPriceAmount: Money;
    adultPrice: Money;
    childrenPrice: Money;
    startDate: moment.Moment;
    returnDate: moment.Moment;
    roomOffers: any;
    merchantId: string;
}

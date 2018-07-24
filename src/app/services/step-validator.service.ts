import { Injectable } from '@angular/core';
import { Birthday } from '../models/birthday';

import * as moment from 'moment';

@Injectable()
export class StepValidatorService {

  constructor() { }

  validateChildrenBirthdays(dates: Array<Birthday>): boolean {
    for (const date of dates) {

      if (!this.validateBirthday(date)) {
        return false;
      }
    }

    return true;
  }

  private validateBirthday(birthday: Birthday): boolean {
    const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);
    const days = range(1, 32);

    if (!days.includes(birthday.day) ) {
        return false;
    }

    const months = range(1, 13);
    if (!months.includes(birthday.month) ) {
        return false;
    }

    const currentYear = moment().get('year');
    const limitChildrenYear = currentYear - 17;

    if (birthday.year < limitChildrenYear || birthday.year > currentYear) {
      return false;
    }

    const date = moment(birthday.day + '-' + birthday.month + '-' + birthday.year, 'DD-MM-YYYY');

    if (!date.isValid()) {
      return false;
    }

    if (!date.isBefore(moment())) {
      return false;
    }

    return true;
  }

}

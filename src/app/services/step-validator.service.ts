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

    if (!days.includes(parseInt(birthday.day, 10)) ) {
      console.log('invalid day');
      return false;
    }

    const months = range(1, 13);
    if (!months.includes(parseInt(birthday.month, 10)) ) {
      console.log('invalid month');
      return false;
    }

    const currentYear = moment().get('year');
    const limitChildrenYear = currentYear - 17;

    if (parseInt(birthday.year, 10) < limitChildrenYear || parseInt(birthday.year, 10) > currentYear) {
      console.log('older than 17, not a child');
      return false;
    }

    const date = moment(birthday.day + '-' + birthday.month + '-' + birthday.year, 'DD-MM-YYYY');

    if (!date.isValid()) {
      console.log('invalid date');
      return false;
    }

    if (!date.isBefore(moment())) {
      console.log('date in the future');
      return false;
    }

    return true;
  }

}

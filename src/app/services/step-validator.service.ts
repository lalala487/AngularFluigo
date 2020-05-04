import { Injectable } from '@angular/core';
import { Birthday } from '../models/birthday';
import moment from 'moment/moment';
import { UserContact } from '../models/user-contact';

@Injectable({
  providedIn: 'root'
})
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

  validateUserContact(user: UserContact) {
    if (!(user.firstName || user.lastName)) {
      return false;
    }

    if (!user.email) {
      return false;
    }

    if (!user.phoneNumber) {
      return false;
    }

    return true;
  }

  private validateBirthday(birthday: Birthday): boolean {
    const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);
    const days = range(1, 32);

    if (!days.includes(parseInt(birthday.day, 10)) ) {
      return false;
    }

    const months = range(1, 13);
    if (!months.includes(parseInt(birthday.month, 10)) ) {
      return false;
    }

    const currentYear = moment().get('year');
    const limitChildrenYear = currentYear - 17;

    if (parseInt(birthday.year, 10) < limitChildrenYear || parseInt(birthday.year, 10) > currentYear) {
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

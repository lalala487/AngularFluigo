import { Component, OnInit, Input } from '@angular/core';
import { firestore } from 'firebase';

@Component({
  selector: 'app-date-countdown-circle',
  templateUrl: './date-countdown-circle.component.html',
  styleUrls: ['./date-countdown-circle.component.css']
})
export class DateCountdownCircleComponent implements OnInit {
  @Input() endDate: firestore.Timestamp;
  wasReached = false;

  maxDaysDealIsValid = 14;

  maxMinutesInSeconds = 60 * 60;
  maxHoursInSeconds = 24 * this.maxMinutesInSeconds;
  maxDaysInSeconds = this.maxDaysDealIsValid * this.maxHoursInSeconds;

  left = {
    'months': 0,
    'weeks': 0,
    'days': 0,
    'hours': 0,
    'minutes': 0,
    'seconds': 0,
  };

  maxLeft = {
    'months': 0,
    'weeks': 0,
    'days': 0,
    'hours': 0,
    'minutes': 0,
    'seconds': 0,
  };

  units = ['days', 'hours', 'minutes', 'seconds'];

  constructor() {
    setInterval(() => this.updateCountdown(this.left), 1000);
  }

  updateCountdown(counter): void {
    if (this.wasReached) {
      return;
    }

    const now: any = new Date();
    const givenDate: any = new Date(this.endDate.toDate());

    const dateDifference: any = givenDate - now;

    if ((dateDifference < 100 && dateDifference > 0) || dateDifference < 0 && !this.wasReached) {
      this.wasReached = true;
    }

    const lastUnit = this.units[this.units.length - 1];

    const unitConstantForMillisecs = {
      days: (1000 * 60 * 60 * 24),
      hours: (1000 * 60 * 60),
      minutes: (1000 * 60),
      seconds: 1000
    };

    let totalMillisecsLeft = dateDifference;

    const unitsLeft = {};

    for (const key in this.units) {
      if (this.units.hasOwnProperty(key)) {
        const unit = this.units[key];

        unitsLeft[unit] = (this.wasReached) ? 0 : totalMillisecsLeft / unitConstantForMillisecs[unit];
        if (lastUnit === unit) {
          unitsLeft[unit] = Math.ceil(unitsLeft[unit]);
        } else {
          unitsLeft[unit] = Math.floor(unitsLeft[unit]);
        }

        totalMillisecsLeft -= unitsLeft[unit] * unitConstantForMillisecs[unit];

        unitsLeft[unit] = unitsLeft[unit] > 0 ? unitsLeft[unit] : 0;

        counter[unit] = unitsLeft[unit];
      }
    }
  }

  ngOnInit() {
    this.updateCountdown(this.maxLeft);
  }

}

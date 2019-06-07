import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firestore } from 'firebase';

import * as moment from 'moment';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent implements OnInit {
  emailSent = false;

  endDate: firestore.Timestamp;

  constructor(
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    const date = moment('2019-08-01').toDate();

    this.endDate = firestore.Timestamp.fromDate(date);

  }

  isLoggedInChange(isLoggedIn: boolean): void {
    console.log('loggedIn changed', isLoggedIn);
  }

  emailSentChanged(emailSent: boolean): void {
    this.emailSent = emailSent;
    this.toastr.info('Du bekommst jetzt ein E-Mail', 'Perfekt');
  }

}

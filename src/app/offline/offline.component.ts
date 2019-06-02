import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent implements OnInit {
  emailSent = false;

  constructor(
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
  }

  isLoggedInChange(isLoggedIn: boolean): void {
    console.log('loggedIn changed', isLoggedIn);
    console.log('loggedIn changed', isLoggedIn);
    this.toastr.info('loggedIn changed');
  }

  emailSentChanged(emailSent: boolean): void {
    this.emailSent = emailSent;
    this.toastr.info('emailSent');
  }

}

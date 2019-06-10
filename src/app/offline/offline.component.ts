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
  }

  emailSentChanged(emailSent: boolean): void {
    this.emailSent = emailSent;
    this.toastr.info('Du bekommst jetzt ein E-Mail', 'Perfekt');
  }

}

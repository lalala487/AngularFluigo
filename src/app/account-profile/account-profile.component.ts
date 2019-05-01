import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserContact } from '../models/user-contact';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.css']
})
export class AccountProfileComponent implements OnInit {
  @Input() userContact: UserContact;
  @Output() userContactChange: EventEmitter<UserContact> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  updateUser() {
    this.userContactChange.emit(this.userContact);
  }

}

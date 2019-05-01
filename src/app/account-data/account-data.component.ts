import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-data',
  templateUrl: './account-data.component.html',
  styleUrls: ['./account-data.component.css']
})
export class AccountDataComponent implements OnInit {
  email: string;

  @Output() deleteUserChange: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  deleteUser() {
    if (window.confirm('Are you sure to delete the user ' + this.email)) {
      this.deleteUserChange.emit(this.email);
    }
  }

}

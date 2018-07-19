import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-quantity',
  templateUrl: './user-quantity.component.html',
  styleUrls: ['./user-quantity.component.css']
})
export class UserQuantityComponent implements OnInit {
  @Input() userNumber: number;
  @Output() userNumberChange: EventEmitter<any> = new EventEmitter();

  numberOfUsers = [1, 2, 3, 4, 5, 6];

  selectNumberOfUsers(user) {
    this.userNumber = user;

    this.userNumberChange.emit(this.userNumber);
  }

  constructor() { }

  ngOnInit() {
  }

}

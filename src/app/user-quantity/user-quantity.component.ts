import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-quantity',
  templateUrl: './user-quantity.component.html',
  styleUrls: ['./user-quantity.component.css']
})
export class UserQuantityComponent implements OnInit {
  @Input() childrenNumber: number;
  @Input() adultNumber: number;

  @Output() childrenNumberChange: EventEmitter<any> = new EventEmitter();
  @Output() adultNumberChange: EventEmitter<any> = new EventEmitter();

  onChildrenChange(value) {
    this.childrenNumber = value;

    this.childrenNumberChange.emit(this.childrenNumber);
  }

  onAdultChange(value) {
    this.adultNumber = value;

    this.adultNumberChange.emit(this.adultNumber);
  }

  constructor() { }

  ngOnInit() {
  }

}

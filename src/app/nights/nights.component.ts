import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nights',
  templateUrl: './nights.component.html',
  styleUrls: ['./nights.component.css']
})
export class NightsComponent implements OnInit {

  @Input() numberOfNights = 3;
  @Output() selectedNightChange: EventEmitter<any> = new EventEmitter();

  // dropdownList: Array<Night> = [
  //   { 'id': 3, 'value': '3 Nächte' } as Night,
  //   { 'id': 4, 'value': '4 nights' } as Night,
  // ];

  nightList = [3, 4];

  constructor() { }

  ngOnInit() {
  }

  onChange(newValue) {
    console.log(newValue);
    this.numberOfNights = newValue;

    this.selectedNightChange.emit(this.numberOfNights);
  }
}

interface Night {
  id: Number;
  value: string;
}

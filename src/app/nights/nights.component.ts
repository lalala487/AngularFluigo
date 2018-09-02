import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nights',
  templateUrl: './nights.component.html',
  styleUrls: ['./nights.component.css']
})
export class NightsComponent implements OnInit {

  @Input() numberOfNights = 3;
  @Output() selectedNightChange: EventEmitter<any> = new EventEmitter();

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

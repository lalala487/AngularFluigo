import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nights',
  templateUrl: './nights.component.html',
  styleUrls: ['./nights.component.css']
})
export class NightsComponent {
  @Input() numberOfNights;
  @Input() listOfNights: any;

  @Output() selectedNightChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  onChange(newValue) {
    this.numberOfNights = newValue;

    this.selectedNightChange.emit(this.numberOfNights);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Airport } from '../models/airport';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrls: ['./airport-list.component.css']
})
export class AirportListComponent implements OnInit {
  airports: Array<Airport> = [{ name: 'Zürich', value: 'hfVxPrPOE7ct3L3Iy5Eg' } as Airport];

  @Input() selectedAirport;
  @Output() selectedAirportChange: EventEmitter<Airport> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  compareFn(a, b) {
    return a && b && a.value === b.value;
  }

  onChange(newValue) {
    console.log(newValue);
    this.selectedAirport = newValue;

    this.selectedAirportChange.emit(this.selectedAirport);
  }
}

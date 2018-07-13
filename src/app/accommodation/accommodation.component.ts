import { Component, OnInit, Input } from '@angular/core';
import { Accommodation } from '../models/accommodation';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})
export class AccommodationComponent implements OnInit {
  @Input() accommodation: Accommodation;

  constructor() { }

  ngOnInit() {
  }

}

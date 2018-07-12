import { Component, OnInit, Input } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { City } from '../models/city';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  @Input() city: City;
  @Input() imageUrl: SafeStyle;

  constructor() { }

  ngOnInit() {
  }

}

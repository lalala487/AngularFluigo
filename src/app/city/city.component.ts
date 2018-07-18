import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { City } from '../models/city';
import { Amenity } from '../models/amenity';
import { CollectionsService } from '../services/collections.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
  providers: [CollectionsService]
})
export class CityComponent implements OnChanges {

  @Input() city: City;
  @Input() imageUrl: SafeStyle;

  featuredList: Array<Amenity> = [];

  locale = environment.locale;

  constructor(
    private collectionUtils: CollectionsService,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    const city: SimpleChange = changes.city;

    if (city) {
      this.city = city.currentValue as City;
      this.featuredList = this.city ? this.collectionUtils.getCollection<Amenity>(this.city.featured) : [];
    }
  }

}

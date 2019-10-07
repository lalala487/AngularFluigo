import { Component, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { Restaurant } from '../models/restaurant';
import { environment } from 'src/environments/environment';
import { StarServiceService } from '../services/star-service.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnChanges {
  locale = environment.locale;

  @Input() restaurant: Restaurant;
  maxRating = 5;

  constructor(private starService: StarServiceService) { }

  starFillingPercentage: number;
  fullStars: Array<number> = [];
  emptyStars: Array<number> = [];

  ngOnChanges(changes: SimpleChanges) {
    const restaurant: SimpleChange = changes.restaurant;

    if (restaurant !== undefined) {
      this.restaurant = restaurant.currentValue as Restaurant;

      [this.starFillingPercentage, this.fullStars, this.emptyStars] = this.starService.getStarInformation(
        this.restaurant.rating.rating, this.maxRating
      );
    }
  }
}

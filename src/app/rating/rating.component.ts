import { Component, OnInit, OnChanges, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { StarServiceService } from '../services/star-service.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnChanges {
  @Input() rating: number;

  maxRating = 5;

  constructor(private starService: StarServiceService) { }

  starFillingPercentage: number;
  fullStars: Array<number> = [];
  emptyStars: Array<number> = [];

  ngOnChanges(changes: SimpleChanges) {
    const rating: SimpleChange = changes.rating;

    if (rating !== undefined) {
      this.rating = rating.currentValue as number;

      [this.starFillingPercentage, this.fullStars, this.emptyStars] = this.starService.getStarInformation(this.rating, this.maxRating);
    }
  }

}

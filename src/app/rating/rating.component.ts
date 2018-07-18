import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnChanges {
  @Input() rating: number;

  maxRating = 5;

  starFillingPercentage: number;
  fullStars: Array<number> = [];
  emptyStars: Array<number> = [];

  ngOnChanges(changes: SimpleChanges) {
    const rating: SimpleChange = changes.rating;

    if (rating !== undefined) {
      this.rating = rating.currentValue as number;

      this.starFillingPercentage = this.getStarFillingPercentage(this.rating);

      if (this.rating >= 1) {
        this.fullStars = Array(Math.floor(this.rating));
      }

      if (this.fullStars.length !== 5) {
        this.emptyStars = Array(Math.floor(this.maxRating - (this.fullStars.length + 1)));
      }
    }
  }

  getStarFillingPercentage(rating: number): number {
    return Number(((rating - Math.floor(rating)) * 10).toFixed(0));
  }

}

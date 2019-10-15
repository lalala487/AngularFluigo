import { Component, OnInit, Input } from '@angular/core';
import { StarServiceService } from '../services/star-service.service';

@Component({
  selector: 'app-heart-list',
  templateUrl: './heart-list.component.html',
  styleUrls: ['./heart-list.component.css']
})
export class HeartListComponent implements OnInit {
  maxRating = 5;
  @Input() rating: number;
  @Input() showNumber = true;

  starFillingPercentage: number;
  fullStars: Array<number> = [];
  emptyStars: Array<number> = [];

  constructor(private starService: StarServiceService) { }

  ngOnInit() {
    [this.starFillingPercentage, this.fullStars, this.emptyStars] = this.starService.getStarInformation(
      this.rating, this.maxRating
    );
  }

}
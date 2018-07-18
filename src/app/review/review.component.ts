import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Review } from '../models/review';
import { SafeUrl } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnChanges {
  @Input() review: Review;
  imageUrl: SafeUrl;
  locale = environment.locale;

  constructor(
    private imageService: ImageService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const review: SimpleChange = changes.review;
    this.review = review.currentValue;

    if (this.review) {
      const image = this.review.image['main'];

      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => this.imageUrl = this.imageService.sanitizeUrl(url)
      );
    }
  }
}

import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { Review } from '../models/review';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ImageService } from '../services/image.service';

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

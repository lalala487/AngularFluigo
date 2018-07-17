import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Amenity } from '../models/amenity';
import { SafeUrl } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-featured-icon',
  templateUrl: './featured-icon.component.html',
  styleUrls: ['./featured-icon.component.css']
})
export class FeaturedIconComponent implements OnChanges {
  @Input() featured: Amenity;
  imageUrl: SafeUrl;

  constructor(
    private imageService: ImageService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const featured: SimpleChange = changes.featured;
    this.featured = featured.currentValue;

    if (this.featured && this.featured.image) {
      const image = this.featured.image['main'];

      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => this.imageUrl = this.imageService.sanitizeUrl(url)
      );
    }
  }

}

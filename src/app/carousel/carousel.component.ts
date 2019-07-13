import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ImageField } from '../models/fields/image';
import { ImageService } from '../services/image.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnChanges {
  @Input() carouselImages: ImageField;

  images: SafeUrl[];

  constructor(
    private imageService: ImageService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    const carouselImage: SimpleChange = changes.carouselImages;

    if (!carouselImage.currentValue) {
      return;
    }

    const value: ImageField = carouselImage.currentValue;

    this.images = [];
    Object.values(value).map(image => {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.images.push(this.imageService.sanitizeUrl(url));
        }
      );
    });
  }
}

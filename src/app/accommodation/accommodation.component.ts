import { Component, OnInit, Input } from '@angular/core';
import { Accommodation } from '../models/accommodation';
import { ImageService } from '../services/image.service';
import { SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})
export class AccommodationComponent implements OnInit {
  @Input() accommodation: Accommodation;
  imageUrl: SafeStyle;

  constructor(
    private imageService: ImageService
  ) { }

  ngOnInit() {
    const image = this.accommodation ? this.accommodation.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => this.imageUrl = this.imageService.sanitizeImage(url)
      );
    }
  }

}

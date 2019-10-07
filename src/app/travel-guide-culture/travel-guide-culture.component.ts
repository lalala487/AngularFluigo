import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SafeStyle } from '@angular/platform-browser';
import { ImageTextField } from '../models/travel-guide';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-travel-guide-culture',
  templateUrl: './travel-guide-culture.component.html',
  styleUrls: ['./travel-guide-culture.component.css']
})
export class TravelGuideCultureComponent implements OnInit, OnChanges {

  locale = environment.locale;
  imageUrl: SafeStyle;
  @Input() culture: ImageTextField;

  constructor(
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    const image = this.culture ? this.culture.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.imageUrl = this.imageService.sanitizeImage(url);
        }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const culture: SimpleChange = changes.culture;

    if (!culture.currentValue) {
      return;
    }

    this.culture = culture.currentValue as ImageTextField;

    const image = this.culture ? this.culture.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.imageUrl = this.imageService.sanitizeImage(url);
        }
      );
    }

  }

}

import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ImageTextField } from '../models/travel-guide';
import { environment } from 'src/environments/environment';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-travel-guide-history',
  templateUrl: './travel-guide-history.component.html',
  styleUrls: ['./travel-guide-history.component.css']
})
export class TravelGuideHistoryComponent implements OnInit, OnChanges {
  locale = environment.locale;
  imageUrl: SafeStyle;
  @Input() history: ImageTextField;

  constructor(
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    const image = this.history ? this.history.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.imageUrl = this.imageService.sanitizeImage(url);
        }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const history: SimpleChange = changes.history;

    if (!history.currentValue) {
      return;
    }

    this.history = history.currentValue as ImageTextField;

    const image = this.history ? this.history.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.imageUrl = this.imageService.sanitizeImage(url);
        }
      );
    }

  }

}

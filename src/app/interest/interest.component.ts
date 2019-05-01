import { Component, OnInit, OnChanges, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { Interest } from '../models/interest';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnChanges {
  @Input() interest: Interest;
  imageUrl: SafeUrl;

  locale = environment.locale;

  constructor(
    private imageService: ImageService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const interest: SimpleChange = changes.interest;

    if (!interest.currentValue) {
      return;
    }

    interest.currentValue.subscribe(innerInterest => {
      this.interest = innerInterest;

      if (this.interest && this.interest.image['main']) {
        const image = this.interest.image['main'];

        this.imageService.getImageDownloadUrl$(image).subscribe(
          url => this.imageUrl = this.imageService.sanitizeUrl(url)
        );
      }
    });
  }

}

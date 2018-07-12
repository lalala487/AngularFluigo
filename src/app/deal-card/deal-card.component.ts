import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-deal-card',
  templateUrl: './deal-card.component.html',
  styleUrls: ['./deal-card.component.css'],
})
export class DealCardComponent implements OnChanges {
  @Input() deal: any;

  imageUrl: SafeStyle;

  constructor(protected db: FirestoreService, protected imageService: ImageService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const deal: SimpleChange = changes.deal;

    if (deal) {
      const newValue = deal.currentValue;
      const city = newValue.city[0];

      if (city) {
        this.db.doc$('city/' + city.id).subscribe(innerCity => {
          const image = innerCity['image'].main;

          this.imageService.getImageDownloadUrl$(image).subscribe(
            url => this.imageUrl = this.imageService.sanitizeImage(url)
          );
        });
      }
    }
    // TODO: have a default img
  }

}

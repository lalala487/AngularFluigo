import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Deal } from '../models/deal';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { City } from '../models/city';

@Component({
  selector: 'app-deal-card',
  templateUrl: './deal-card.component.html',
  styleUrls: ['./deal-card.component.css']
})
export class DealCardComponent implements OnChanges {
  @Input() deal: Deal;

  imageUrl: SafeStyle;

  constructor(
    private db: AngularFirestore,
    protected imageService: ImageService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const deal: SimpleChange = changes.deal;

    if (deal) {
      const newValue = deal.currentValue;
      const cityRef = newValue.city[0];

      if (cityRef) {
        this.db.doc<City>('city/' + cityRef.id).valueChanges().subscribe(city => {
          const image = city.image.main;

          this.imageService.getImageDownloadUrl$(image).subscribe(
            (url: string) => this.imageUrl = this.imageService.sanitizeImage(url)
          );
        });
      }
    }
    // TODO: have a default img
  }

}

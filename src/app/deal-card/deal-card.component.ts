import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-deal-card',
  templateUrl: './deal-card.component.html',
  styleUrls: ['./deal-card.component.css']
})
export class DealCardComponent implements OnChanges {
  @Input() deal: any;

  imageUrl: SafeStyle;

  constructor(protected db: FirestoreService, protected storage: AngularFireStorage, protected sanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const deal: SimpleChange = changes.deal;

    if (deal) {
      const newValue = deal.currentValue;
      const city = newValue.city[0];

      if (city) {
        this.db.doc$('city/' + city.id).subscribe(innerCity => {
          const image = innerCity['image'].main;

          const ref = this.storage.ref(image);
          ref.getDownloadURL().subscribe(img => {
            this.imageUrl = this.sanitizer.bypassSecurityTrustStyle('url(' + img + ')');
          });
        });
      }
    }
    // TODO: have a default img
  }

}

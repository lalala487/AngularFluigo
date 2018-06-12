import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-deal-card',
  templateUrl: './deal-card.component.html',
  styleUrls: ['./deal-card.component.css']
})
export class DealCardComponent implements OnChanges {
  @Input() deal: any;

  imageUrl: Observable<string | null>;

  constructor(protected db: FirestoreService, protected storage: AngularFireStorage) {
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
          this.imageUrl = ref.getDownloadURL();
        });
      }
    }
    // TODO: have a default img
  }
}

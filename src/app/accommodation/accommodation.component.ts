import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Accommodation } from '../models/accommodation';
import { SafeStyle } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ImageService } from '../services/image.service';
import { Interest } from '../models/interest';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})
export class AccommodationComponent implements OnInit, OnChanges {
  @Input() accommodation: Accommodation;
  imageUrl: SafeStyle;

  locale = environment.locale;

  interestList: Array<Observable<Interest>> = [];

  constructor(
    private imageService: ImageService,
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    const image = this.accommodation ? this.accommodation.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => this.imageUrl = this.imageService.sanitizeImage(url)
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const accommodation: SimpleChange = changes.accommodation;

    if (!accommodation.currentValue) {
      return;
    }

    this.accommodation = accommodation.currentValue as Accommodation;

    if (this.accommodation && this.accommodation.image['main']) {
      const image = this.accommodation.image['main'];

      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => this.imageUrl = this.imageService.sanitizeImage(url)
      );
    }

    const list = this.accommodation.featured.map(interest => {
      return this.db.doc<Interest>(interest.path).valueChanges();
    });
    this.interestList = list;
  }

}

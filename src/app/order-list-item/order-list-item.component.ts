import { Component, OnInit, Input } from '@angular/core';
import { Order, OrderTimestamps } from '../models/order';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { City } from '../models/city';
import { Accommodation } from '../models/accommodation';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { firestore } from 'firebase';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.css']
})
export class OrderListItemComponent implements OnInit {
  @Input() order: OrderTimestamps;
  locale = environment.locale;

  date: Date;

  cityName: string;
  accommodationName: string;

  imageUrl: SafeStyle;

  constructor(
    private db: AngularFirestore,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    if (this.order.city) {
      this.db.doc<City>(this.order.city.path).valueChanges().subscribe(city => {
        this.cityName = city.name[this.locale];

        const image = city.image ? city.image.main : undefined;

        if (image) {
          this.imageService.getImageDownloadUrl$(image).subscribe(
            url => this.imageUrl = this.imageService.sanitizeImage(url)
          );
        }
      });
    }

    if (this.order.accommodation) {
      this.db.doc<Accommodation>(this.order.accommodation.path).valueChanges().subscribe(accommodation => {
        this.accommodationName = accommodation.name[this.locale];
      });
    }
  }

}

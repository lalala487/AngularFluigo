import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Accommodation } from '../models/accommodation';
import { ImageService } from '../services/image.service';
import { SafeStyle } from '@angular/platform-browser';
import { Amenity } from '../models/amenity';
import { CollectionsService } from '../services/collections.service';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css'],
  providers: [CollectionsService]
})
export class AccommodationComponent implements OnInit, OnChanges {
  @Input() accommodation: Accommodation;
  imageUrl: SafeStyle;

  starNumber: number;


  featuredList: Array<Amenity> = [];

  constructor(
    private imageService: ImageService,
    private collectionUtils: CollectionsService,
  ) { }

  ngOnInit() {
    const image = this.accommodation ? this.accommodation.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => this.imageUrl = this.imageService.sanitizeImage(url)
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const accommodation: SimpleChange = changes.accommodation;

    if (accommodation) {
      this.accommodation = accommodation.currentValue as Accommodation;
      this.featuredList = this.accommodation ? this.collectionUtils.getCollection<Amenity>(this.accommodation.featured) : [];

      this.starNumber = this.getStarNumber(this.accommodation.rating);
    }
  }

  getStarNumber(rating: number): number {
    return Math.floor(rating * 2);
  }

}

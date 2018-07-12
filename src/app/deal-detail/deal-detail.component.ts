import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['./deal-detail.component.css']
})
export class DealDetailComponent implements OnInit {
  slug: string;
  @Input() deal: Deal;
  accommodation: any;
  city: City;
  imageUrl: SafeStyle;

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.slug = params.get('slug');

        return this.db.col$('deal', ref => ref.where('slug', '==', this.slug));
      }).subscribe(deals => {
        this.deal = deals ? deals[0] as Deal : undefined;

        this.accommodation = this.deal.accommodation ? this.deal.accommodation[0] : undefined;
        const cityRef = this.deal.city ? this.deal.city[0] : undefined;

        if (cityRef) {
          this.db.doc$('city/' + cityRef.id).subscribe(innerCity => {
            this.city = innerCity as City;

            const image = innerCity['image'].main;

            this.imageService.getImageDownloadUrl$(image).subscribe(
              url => this.imageUrl = this.imageService.sanitizeImage(url)
            );
          });
        }
      });
  }
}

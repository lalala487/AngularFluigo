import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { TravelGuide } from '../models/travel-guide';
import { environment } from 'src/environments/environment';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-travel-guide',
  templateUrl: './travel-guide.component.html',
  styleUrls: ['./travel-guide.component.css']
})
export class TravelGuideComponent implements OnInit, OnChanges {
  @Input() travelGuide: TravelGuide;
  locale = environment.locale;
  imageUrl: SafeStyle;

  MAX_NUMBER_GUIDES = 4;

  guides$: Observable<TravelGuide[]>;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    const selectedTravelGuide$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const query = ref => ref.where('slug', '==', params.get('slug')).limit(1);

        return this.db.collection('guide', query).valueChanges();
      })
    );

    selectedTravelGuide$.subscribe((guides: TravelGuide[]) => {
      this.travelGuide = guides[0];

      this.updateImage();
    });

    this.guides$ = this.db.collection<TravelGuide>(
      'guide',
      ref => ref.where('active', '==', true).limit(this.MAX_NUMBER_GUIDES)
      ).valueChanges().pipe(
      map(guides => guides.map(guide => {

        guide.imageUrl = this.imageService.getImageDownloadUrl$(guide.image.main).pipe(
          map(url => {
            return this.imageService.sanitizeImage(url);
          })
        );

        return guide;
      }))
    );

  }

  ngOnChanges(changes: SimpleChanges): void {
    const travelGuide: SimpleChange = changes.travelGuide;

    if (!travelGuide.currentValue) {
      return;
    }

    this.travelGuide = travelGuide.currentValue as TravelGuide;

    this.updateImage();
  }

  private updateImage(): void {
    const image = this.travelGuide ? this.travelGuide.image.main : undefined;
    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(url => {
        this.imageUrl = this.imageService.sanitizeImage(url, 'linear-gradient(to bottom right, rgba(19, 78, 94, .5) 0%, rgba(77, 131, 132, .5) 100%), ');
      });
    }
  }

}

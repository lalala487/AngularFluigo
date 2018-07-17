import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFireStorage } from 'angularfire2/storage';
import { AccommodationComponent } from './accommodation.component';
import { ImageService } from '../services/image.service';

import { of } from 'rxjs/observable/of';
import { ReviewComponent } from '../review/review.component';
import { FeaturedIconComponent } from '../featured-icon/featured-icon.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CollectionsService } from '../services/collections.service';
import { FirestoreService } from '../services/firestore.service';
import { firestoreServiceStub } from '../services/firestore.service.stub';

describe('AccommodationComponent', () => {
  let component: AccommodationComponent;
  let fixture: ComponentFixture<AccommodationComponent>;

  beforeEach(async(() => {
    const serviceStub = {
      getContent: () => of(''),
    };

    const collectionServiceStub = {
      getCollection: () => [],
    };

    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [AccommodationComponent, ReviewComponent, FeaturedIconComponent],
      providers: [
        ImageService,
        { provide: FirestoreService, useValue: firestoreServiceStub },
        { provide: CollectionsService, useValue: collectionServiceStub },
        { provide: AngularFireStorage, useValue: serviceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

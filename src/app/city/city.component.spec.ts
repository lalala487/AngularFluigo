import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityComponent } from './city.component';
import { ReviewComponent } from '../review/review.component';
import { ImageService } from '../services/image.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { of } from 'rxjs/observable/of';
import { FeaturedIconComponent } from '../featured-icon/featured-icon.component';
import { FirestoreService } from '../services/firestore.service';
import { firestoreServiceStub } from '../services/firestore.service.stub';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('CityComponent', () => {
  let component: CityComponent;
  let fixture: ComponentFixture<CityComponent>;

  beforeEach(async(() => {
    const serviceStub = {
      getContent: () => of(''),
    };

    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [ CityComponent, ReviewComponent, FeaturedIconComponent ],
      providers: [
        ImageService,
        { provide: FirestoreService, useValue: firestoreServiceStub },
        { provide: AngularFireStorage, useValue: serviceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

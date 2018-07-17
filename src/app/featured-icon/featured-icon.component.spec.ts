import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFireStorage } from 'angularfire2/storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeaturedIconComponent } from './featured-icon.component';
import { ImageService } from '../services/image.service';
import { Amenity } from '../models/amenity';
import { of } from 'rxjs/observable/of';

describe('FeaturedIconComponent', () => {
  let component: FeaturedIconComponent;
  let fixture: ComponentFixture<FeaturedIconComponent>;

  beforeEach(async(() => {
    const serviceStub = {
      getContent: () => of(''),
    };

    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [FeaturedIconComponent],
      providers: [
        ImageService,
        { provide: AngularFireStorage, useValue: serviceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedIconComponent);
    component = fixture.componentInstance;
    component.featured = {'description': {
      'en_GB': 'xpto',
    }} as Amenity;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

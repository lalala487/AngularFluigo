import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityComponent } from './city.component';
import { ReviewComponent } from '../review/review.component';
import { ImageService } from '../services/image.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { of } from 'rxjs/observable/of';

describe('CityComponent', () => {
  let component: CityComponent;
  let fixture: ComponentFixture<CityComponent>;

  beforeEach(async(() => {
    const serviceStub = {
      getContent: () => of(''),
    };

    TestBed.configureTestingModule({
      declarations: [ CityComponent, ReviewComponent ],
      providers: [
        ImageService,
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

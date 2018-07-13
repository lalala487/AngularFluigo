import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFireStorage } from 'angularfire2/storage';
import { AccommodationComponent } from './accommodation.component';
import { ImageService } from '../services/image.service';

import { of } from 'rxjs/observable/of';

describe('AccommodationComponent', () => {
  let component: AccommodationComponent;
  let fixture: ComponentFixture<AccommodationComponent>;

  beforeEach(async(() => {
    const serviceStub = {
      getContent: () => of(''),
    };

    TestBed.configureTestingModule({
      declarations: [ AccommodationComponent ],
      providers: [
        ImageService,
        { provide: AngularFireStorage, useValue: serviceStub }
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

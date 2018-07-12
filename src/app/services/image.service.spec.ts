import { TestBed, inject } from '@angular/core/testing';

import { AngularFireStorage } from 'angularfire2/storage';
import { ImageService } from './image.service';
import { firestoreServiceStub } from './firestore.service.stub';
import { of } from 'rxjs/observable/of';


describe('ImageService', () => {
  beforeEach(() => {
    const serviceStub = {
      getContent: () => of(''),
    };

    TestBed.configureTestingModule({
      providers: [
        ImageService,
        { provide: AngularFireStorage, useValue: serviceStub }
      ]
    });
  });

  it('should be created', inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));
});

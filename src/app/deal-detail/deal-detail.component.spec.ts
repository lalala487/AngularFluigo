import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealDetailComponent } from './deal-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FirestoreService } from '../services/firestore.service';
import { firestoreServiceStub } from '../services/firestore.service.stub';
import { SidebarJSModule } from 'ng-sidebarjs';

describe('DealDetailComponent', () => {
  let component: DealDetailComponent;
  let fixture: ComponentFixture<DealDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SidebarJSModule],
      declarations: [DealDetailComponent],
      providers: [
        { provide: FirestoreService, useValue: firestoreServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

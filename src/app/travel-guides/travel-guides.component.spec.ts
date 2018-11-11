import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelGuidesComponent } from './travel-guides.component';
import { FooterComponent } from '../footer/footer.component';

describe('TravelGuidesComponent', () => {
  let component: TravelGuidesComponent;
  let fixture: ComponentFixture<TravelGuidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelGuidesComponent, FooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

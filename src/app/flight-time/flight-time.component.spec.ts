import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTimeComponent } from './flight-time.component';

describe('FlightTimeComponent', () => {
  let component: FlightTimeComponent;
  let fixture: ComponentFixture<FlightTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

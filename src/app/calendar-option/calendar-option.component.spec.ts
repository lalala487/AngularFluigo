import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarOptionComponent } from './calendar-option.component';

describe('CalendarOptionComponent', () => {
  let component: CalendarOptionComponent;
  let fixture: ComponentFixture<CalendarOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityOptionComponent } from './activity-option.component';

describe('ActivityOptionComponent', () => {
  let component: ActivityOptionComponent;
  let fixture: ComponentFixture<ActivityOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

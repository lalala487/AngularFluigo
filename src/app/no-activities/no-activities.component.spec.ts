import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoActivitiesComponent } from './no-activities.component';

describe('NoActivitiesComponent', () => {
  let component: NoActivitiesComponent;
  let fixture: ComponentFixture<NoActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

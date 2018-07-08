import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgeComponent } from './user-age.component';

describe('UserAgeComponent', () => {
  let component: UserAgeComponent;
  let fixture: ComponentFixture<UserAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

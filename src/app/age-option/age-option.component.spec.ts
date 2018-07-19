import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeOptionComponent } from './age-option.component';

describe('AgeOptionComponent', () => {
  let component: AgeOptionComponent;
  let fixture: ComponentFixture<AgeOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

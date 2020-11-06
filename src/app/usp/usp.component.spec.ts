import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UspComponent } from './usp.component';

describe('UspComponent', () => {
  let component: UspComponent;
  let fixture: ComponentFixture<UspComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

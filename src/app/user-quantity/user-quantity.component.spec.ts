import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuantityComponent } from './user-quantity.component';
import { NumberPickerComponent } from '../number-picker/number-picker.component';

describe('UserQuantityComponent', () => {
  let component: UserQuantityComponent;
  let fixture: ComponentFixture<UserQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQuantityComponent, NumberPickerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

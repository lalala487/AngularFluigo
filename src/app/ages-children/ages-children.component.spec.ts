import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgesChildrenComponent } from './ages-children.component';
import { FormsModule } from '../../../node_modules/@angular/forms';

describe('AgesChildrenComponent', () => {
  let component: AgesChildrenComponent;
  let fixture: ComponentFixture<AgesChildrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ AgesChildrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgesChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

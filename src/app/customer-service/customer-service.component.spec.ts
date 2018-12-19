import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceComponent } from './customer-service.component';
import { FooterComponent } from '../footer/footer.component';

describe('CustomerServiceComponent', () => {
  let component: CustomerServiceComponent;
  let fixture: ComponentFixture<CustomerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerServiceComponent, FooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

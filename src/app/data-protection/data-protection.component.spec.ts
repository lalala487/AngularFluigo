import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtectionComponent } from './data-protection.component';
import { FooterComponent } from '../footer/footer.component';

describe('DataProtectionComponent', () => {
  let component: DataProtectionComponent;
  let fixture: ComponentFixture<DataProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtectionComponent, FooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

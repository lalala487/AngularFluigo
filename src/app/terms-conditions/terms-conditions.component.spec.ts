import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgbComponent } from './agb.component';
import { FooterComponent } from '../footer/footer.component';

describe('AgbComponent', () => {
  let component: AgbComponent;
  let fixture: ComponentFixture<AgbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgbComponent, FooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

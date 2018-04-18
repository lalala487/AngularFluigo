import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDealComponent } from './home-deal.component';

describe('HomeDealComponent', () => {
  let component: HomeDealComponent;
  let fixture: ComponentFixture<HomeDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOrderDocumentListComponent } from './account-order-document-list.component';

describe('AccountOrderDocumentListComponent', () => {
  let component: AccountOrderDocumentListComponent;
  let fixture: ComponentFixture<AccountOrderDocumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOrderDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

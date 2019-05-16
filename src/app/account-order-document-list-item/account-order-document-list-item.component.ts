import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-account-order-document-list-item',
  templateUrl: './account-order-document-list-item.component.html',
  styleUrls: ['./account-order-document-list-item.component.css']
})
export class AccountOrderDocumentListItemComponent implements OnInit {
  @Input() document: string;

  constructor() { }

  ngOnInit() {
  }

}

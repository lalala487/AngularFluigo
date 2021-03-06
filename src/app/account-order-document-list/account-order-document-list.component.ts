import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-order-document-list',
  templateUrl: './account-order-document-list.component.html',
  styleUrls: ['./account-order-document-list.component.css']
})
export class AccountOrderDocumentListComponent implements OnInit {
  @Input() documents: Array<string>;
  @Output() goBackEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  goBack() {
    this.goBackEmitter.emit(true);

  }

}

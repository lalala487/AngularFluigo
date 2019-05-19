import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderTimestamps } from '../models/order';
@Component({
  selector: 'app-account-order-documents',
  templateUrl: './account-order-documents.component.html',
  styleUrls: ['./account-order-documents.component.css']
})
export class AccountOrderDocumentsComponent implements OnInit {
  @Input() order: OrderTimestamps;
  @Output() goBackToMainEmitter: EventEmitter<boolean> = new EventEmitter();

  documents = [];

  selectedDocument;

  constructor() { }

  ngOnInit() {
  }

  chooseDocuments(documentType: string) {
    this.documents = this.order.documents[documentType];
  }

  goBackEmitter(goBack: boolean) {
    this.documents = [];
    this.selectedDocument = undefined;
  }

  goBackToMain() {
   this.goBackToMainEmitter.emit(true);
  }
}

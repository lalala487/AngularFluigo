import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderTimestamps } from '../models/order';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

  chooseDocuments(documentType: string) {
    this.documents = this.order.documents[documentType];
    if (this.documents.length === 0) {
      this.toastr.error('Es gibt noch keine Unterlagen');
    }
  }

  goBackEmitter(goBack: boolean) {
    this.documents = [];
    this.selectedDocument = undefined;
  }

  goBackToMain() {
   this.goBackToMainEmitter.emit(true);
  }
}

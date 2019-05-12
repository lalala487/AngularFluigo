import { Component, OnInit, Input } from '@angular/core';
import { OrderTimestamps } from '../models/order';
@Component({
  selector: 'app-order-documents',
  templateUrl: './account-order-documents.component.html',
  styleUrls: ['./account-order-documents.component.css']
})
export class AccountOrderDocumentsComponent implements OnInit {
  @Input() order: OrderTimestamps;

  constructor() { }

  ngOnInit() {
  }
}

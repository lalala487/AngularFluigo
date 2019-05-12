import { Component, OnInit, Input } from '@angular/core';
import { OrderTimestamps } from '../models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @Input() order: OrderTimestamps;

  constructor() { }

  ngOnInit() {
  }

}

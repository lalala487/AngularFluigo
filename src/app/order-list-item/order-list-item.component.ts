import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.css']
})
export class OrderListItemComponent implements OnInit {

  orders$: Observable<Order[]>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
    this.angularFireAuth.user.subscribe(innerUser => {
      if (!innerUser) {
        return;
      }

      const userId = innerUser.uid;

      this.db.collection<Order>(
        'order',
      ).valueChanges().subscribe(orders => {
        console.log('orders', orders);
      });

      this.orders$ = this.db.collection<Order>(
        'order',
      ).valueChanges();
    });
  }

}

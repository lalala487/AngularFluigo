import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.css']
})
export class AccountOrdersComponent implements OnInit {

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

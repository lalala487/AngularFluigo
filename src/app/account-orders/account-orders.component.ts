import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { OrderTimestamps } from '../models/order';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.css']
})
export class AccountOrdersComponent implements OnInit {
  orders$: Observable<OrderTimestamps[]>;
  @Output() orderDocumentSelected: EventEmitter<OrderTimestamps> = new EventEmitter();

  selectedOrder: OrderTimestamps;

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

      this.orders$ = this.db.collection<OrderTimestamps>(
        'order',
        ref => ref.where('userId', '==', userId)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as OrderTimestamps;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    });
  }

  selectedOrderChange(order: OrderTimestamps) {
    this.selectedOrder = order;
    this.orderDocumentSelected.emit(order);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderTimestamps } from '../models/order';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderId: string;
  order: OrderTimestamps;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private db: AngularFirestore
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const orderId = params.get('orderId');

      if (!orderId) {
        this.router.navigate(['/account/orders']);
      }

      this.db.doc<OrderTimestamps>('/order/' + orderId).valueChanges().subscribe(order => {
        order.id = orderId;
        this.order = order;
        console.log('order', order);
      });

    });
  }

}

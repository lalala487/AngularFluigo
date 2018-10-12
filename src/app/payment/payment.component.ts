import { Component, OnInit, HostListener } from '@angular/core';
import { PaymentService } from '../payments/payment.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  handler: any;
  amount = 500;


  constructor(private paymentSvc: PaymentService) { }

  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: '/assets/img/logo.svg',
      locale: 'auto',
      token: token => {
        this.paymentSvc.processPayment(token, this.amount);
      }
    });
  }

  handlePayment() {
    this.handler.open({
      name: 'Flugio',
      amount: this.amount
    });
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

}

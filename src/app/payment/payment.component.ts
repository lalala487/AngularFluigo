import { Component, OnInit, HostListener, Input } from '@angular/core';
import { PaymentService } from '../payments/payment.service';
import { environment } from '../../environments/environment';
import { Money } from 'ts-money';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  handler: any;

  @Input() amount: Money;

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    console.log('amount', this.amount);
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: '/assets/img/logo.svg',
      locale: 'auto',
      token: token => {
        this.paymentService.processPayment(token, this.amount.amount);
      }
    });
  }

  handlePayment() {
    this.handler.open({
      name: 'Flugio',
      amount: this.amount.amount,
      currency: this.amount.currency,
    });
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

}

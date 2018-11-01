import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Money } from 'ts-money';
import { PaymentService } from '../payments/payment.service';
import { Charge, Source } from './models';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements AfterViewInit, OnDestroy {
  @Input() amount: Money;

  @Output() stripeResult = new EventEmitter<Charge | Source>();
  @Output() errorStripe = new EventEmitter;

  // The Stripe Elements Card
  @ViewChild('cardElement') cardElement: ElementRef;
  card: any;
  formError: string;
  formComplete = false;

  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;

  // Result used locacally to display status.
  result: Charge | Source;

  // State of async activity
  loading = false;

  constructor(
    private paymentService: PaymentService,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    const style = {
    base: {
      lineHeight: '24px',
      fontFamily: '"Roboto", "Helvetica Neue", "Helvetica", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      letterSpacing: '1.12px',
      iconColor: 'rgba(235, 235, 235, 1)',
      color: 'rgba(235, 235, 235, 1)',
      '::placeholder': {
        color: 'rgba(235, 235, 235, .5)'
      }
    },
    invalid: {
      color: 'rgba(235, 235, 235, .5)',
    }
    };

    this.card = this.paymentService.elements.create('cardNumber', { style });
    this.card.mount(this.cardElement.nativeElement);

    const cardExpiryElement = this.paymentService.elements.create('cardExpiry', {
      style: style
    });
    cardExpiryElement.mount('#card-expiry-element');

    const cardCvcElement = this.paymentService.elements.create('cardCvc', {
      style: style
    });
    cardCvcElement.mount('#card-cvc-element');

    console.log('this.card', this.card);
    console.log('this.amount', this.amount);

    // Listens to change event on the card for validation errors
    this.card.on('change', (evt) => {
      this.formError = evt.error ? evt.error.message : null;
      this.cardNumberComplete = evt.complete;
      this.cd.detectChanges();
    });

    cardExpiryElement.on('change', (evt) => {
      this.formError = evt.error ? evt.error.message : null;
      this.cardExpiryComplete = evt.complete;
      this.cd.detectChanges();
    });

    cardCvcElement.on('change', (evt) => {
      this.formError = evt.error ? evt.error.message : null;
      this.cardCvcComplete = evt.complete;
      this.cd.detectChanges();
    });
  }

  formHandler(): void {
    console.log('submit', this.amount.amount);
    this.loading = true;

    console.log('card', this.card);

    const action = this.paymentService.createCharge(this.card, this.amount);

    action.subscribe(
      data => {
        this.result = data;
        this.stripeResult.emit(data);
        this.loading = false;
      },
      err => {
        this.result = err;
        this.errorStripe.emit(err);
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    this.card.destroy();
  }
}

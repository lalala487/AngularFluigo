import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Money } from 'ts-money';
import { Source, StripeService, SourceResult } from 'ngx-stripe';
import { Charge } from './payment-models';
import { PaymentService } from '../services/payment.service';
import { paymentErrorMessages, defaultErrorMessage } from './payment-messages';

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
  @ViewChild('cardElement', { static: true }) cardElement: ElementRef;
  card: any;
  formError: string;
  formComplete = false;

  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;

  // Result used locacally to display status.
  result: Charge | Source;
  error: SourceResult;

  // State of async activity
  loading = false;

  constructor(
    private paymentService: PaymentService,
    private cd: ChangeDetectorRef,
    private stripeService: StripeService
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

    this.stripeService.elements({ 'locale': 'de' }).subscribe(elements => {
      if (this.card) {
        return;
      }

      this.card = elements.create('cardNumber', { style });
      this.card.mount(this.cardElement.nativeElement);
      const cardExpiryElement = elements.create('cardExpiry', {
        style: style
      });
      cardExpiryElement.mount('#card-expiry-element');

      const cardCvcElement = elements.create('cardCvc', {
        style: style
      });
      cardCvcElement.mount('#card-cvc-element');
      // Listens to change event on the card for validation errors
      this.card.on('change', (event) => {
        this.formError = event.error ? event.error.message : null;
        this.cardNumberComplete = event.complete;
        this.cd.detectChanges();
      });

      cardExpiryElement.on('change', (event) => {
        this.formError = event.error ? event.error.message : null;
        this.cardExpiryComplete = event.complete;
        this.cd.detectChanges();
      });

      cardCvcElement.on('change', (event) => {
        this.formError = event.error ? event.error.message : null;
        this.cardCvcComplete = event.complete;
        this.cd.detectChanges();
      });
    });

  }

  formHandler(): void {
    this.loading = true;

    const action = this.paymentService.createCharge$(this.card, this.amount);

    action.subscribe(
      data => {
        this.result = data;
        this.stripeResult.emit(data);
        this.loading = false;
      },
      err => {
        const result = err;

        const code = result.error.raw.decline_code;

        if (paymentErrorMessages[code]) {
          this.errorStripe.emit(paymentErrorMessages[code]);
        } else {
          this.errorStripe.emit(defaultErrorMessage);
        }

        this.error = result.error;
        this.result = result;
        this.loading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.card.destroy();
  }

}

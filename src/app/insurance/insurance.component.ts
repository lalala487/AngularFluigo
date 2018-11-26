import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { TranslatableField } from '../models/fields/translatable';
import { Money, Currencies } from 'ts-money';


@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  @Input() accummulations: Object;

  @Input() hasInsurance: boolean;
  @Input() insurancePrice: Money;

  @Output() hasInsuranceChange: EventEmitter<boolean> = new EventEmitter();
  @Output() insurancePriceChange: EventEmitter<Money> = new EventEmitter();

  insurance: Insurance;
  insuranceMessage: string;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$('insurance').subscribe(collection => {
      this.insurance = collection[0];

      const name = this.insurance.name.de_CH;

      this.db.doc$('insurer/' + this.insurance.insurer.id).subscribe(
        insurer => {
          let price: Money = this.insurancePrice;
          console.log('insurer', insurer);

          console.log('this.insurance.price', this.insurancePrice);
          if (this.insurancePrice.amount === 0) {
            const rate = insurer['commission'] / 100;
            console.log('rate', rate);
            console.log('totalPriceAmount', this.accummulations['totalPriceAmount']);

            price = this.accummulations['totalPriceAmount'].multiply(rate, Math.ceil);
            console.log('price money', price, this.accummulations['totalPriceAmount']);
            this.insurancePrice = price;
            console.log('insurance price', price);
            this.insurancePriceChange.emit(this.insurancePrice);
          }

          this.insuranceMessage = name.replace('xxx', price.currency + ' ' + price.toString());
        }
      );

    });
  }

  yes() {
    this.hasInsurance = true;
    this.hasInsuranceChange.emit(this.hasInsurance);
  }

  no() {
    this.hasInsurance = false;
    this.hasInsuranceChange.emit(this.hasInsurance);
  }
}

interface Insurance {
  active: boolean;
  name: TranslatableField;
  description: TranslatableField;
  currency: string;
  amount: number;
  insurer: any;
}

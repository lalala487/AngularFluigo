import { Component, OnInit, Input } from '@angular/core';
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

  insurance: Insurance;
  insuranceMessage: string;

  rate: number;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$('insurance').subscribe(collection => {
      this.insurance = collection[0];

      this.insuranceMessage = this.insurance.name.de_CH;

      this.db.doc$('insurer/' + this.insurance.insurer.id).subscribe(
        insurer => {
          this.rate = insurer['commission'] / 100;

          const price = Money.fromDecimal(this.rate * this.accummulations['totalPriceAmount'], 'CHF', Math.ceil);

          this.insuranceMessage = this.insuranceMessage.replace('xxx', price.currency + ' ' + price.toString());
        }
      );

    });
  }

  yes() {
    this.accummulations['hasInsurance'] = true;
    this.accummulations['insuranceRate'] = this.rate;
  }

  no() {
    this.accummulations['hasInsurance'] = false;
    this.accummulations['insuranceRate'] = 0;
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

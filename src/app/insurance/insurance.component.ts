import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Money } from 'ts-money';
import { AngularFirestore } from '@angular/fire/firestore';
import { Insurance } from '../models/insurance';
import { Insurer } from '../models/insurer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  @Input() hasInsurance: boolean;
  @Input() insurancePrice: Money;
  @Input() totalPrice: Money;

  @Output() hasInsuranceChange: EventEmitter<boolean> = new EventEmitter();
  @Output() insurancePriceChange: EventEmitter<Money> = new EventEmitter();

  insurance: Insurance;
  insuranceMessage: string;
  locale = environment.locale;

  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.db.collection<Insurance>('insurance').valueChanges().subscribe(collection => {
      this.insurance = collection[0];

      const name = this.insurance.name[this.locale];

      this.db.doc<Insurer>(this.insurance.insurer.path).valueChanges().subscribe(insurer => {
          let price: Money = this.insurancePrice;

          if (this.insurancePrice.amount === 0) {
            const rate = insurer['commission'] / 100;

            price = this.totalPrice.multiply(rate, Math.ceil);
            this.insurancePrice = price;
            this.insurancePriceChange.emit(this.insurancePrice);
          }

          this.insuranceMessage = name.replace('xxx', price.currency + ' ' + price.toString());
      });
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

import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { TranslatableField } from '../models/fields/translatable';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  @Input() accummulations: Object;

  insurance: Insurance;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$('insurance').subscribe(collection => {
      this.insurance = collection[0];
    });
  }

  yes() {
    this.accummulations['hasInsurance'] = true;
    this.accummulations['insurancePrice'] = this.insurance.amount;
  }

  no() {
    this.accummulations['hasInsurance'] = false;
    this.accummulations['insurancePrice'] = 0;
  }
}

interface Insurance {
  active: boolean;
  name: TranslatableField;
  description: TranslatableField;
  currency: string;
  amount: number;
}

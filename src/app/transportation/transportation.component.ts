import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { TranslatableField } from '../models/fields/translatable';
import { Money, Currencies } from 'ts-money';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.css']
})
export class TransportationComponent implements OnInit {
  @Input() hasUpsell: boolean;
  @Input() upsellPrice: Money;

  @Output() hasUpsellChange: EventEmitter<boolean> = new EventEmitter();
  @Output() upsellPriceChange: EventEmitter<Money> = new EventEmitter();

  transportation: Transportation;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$<Transportation>('transportationService').subscribe(collection => {
      this.transportation = collection[0] as Transportation;

      this.upsellPrice = Money.fromDecimal(this.transportation.amount, Currencies.CHF, Math.ceil);
      this.upsellPriceChange.emit(this.upsellPrice);

      if (this.hasUpsell) {
        this.yes();
      }
    });

  }

  yes() {
    this.hasUpsell = true;
    this.hasUpsellChange.emit(this.hasUpsell);
  }

  no() {
    this.hasUpsell = false;
    this.hasUpsellChange.emit(this.hasUpsell);
  }

}

interface Transportation {
  active: boolean;
  name: TranslatableField;
  description: TranslatableField;
  currency: string;
  amount: number;
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { TranslatableField } from '../models/fields/translatable';
import { Money, Currencies } from 'ts-money';

@Component({
  selector: 'app-on-board',
  templateUrl: './on-board.component.html',
  styleUrls: ['./on-board.component.css']
})
export class OnBoardComponent implements OnInit {
  @Input() hasUpsell: boolean;
  @Input() upsellPrice: Money;

  @Output() hasUpsellChange: EventEmitter<boolean> = new EventEmitter();
  @Output() upsellPriceChange: EventEmitter<Money> = new EventEmitter();

  onBoard: OnBoard;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$<OnBoard>('onBoardService').subscribe(collection => {
      this.onBoard = collection[0] as OnBoard;

      this.upsellPrice = Money.fromDecimal(this.onBoard.amount, Currencies.CHF, Math.ceil);
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

interface OnBoard {
  active: boolean;
  name: TranslatableField;
  description: TranslatableField;
  currency: string;
  amount: number;
}

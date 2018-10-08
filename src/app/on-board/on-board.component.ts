import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { TranslatableField } from '../models/fields/translatable';

@Component({
  selector: 'app-on-board',
  templateUrl: './on-board.component.html',
  styleUrls: ['./on-board.component.css']
})
export class OnBoardComponent implements OnInit {
  @Input() hasUpsell: boolean;
  @Input() upsellPrice: number;

  @Output() hasUpsellChange: EventEmitter<boolean> = new EventEmitter();
  @Output() upsellPriceChange: EventEmitter<number> = new EventEmitter();

  onBoard: OnBoard;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$<OnBoard>('onBoardService').subscribe(collection => {
      this.onBoard = collection[0] as OnBoard;
      console.log('onboard amount', this.onBoard.amount, typeof(this.onBoard.amount));

      this.upsellPrice = this.onBoard.amount;
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

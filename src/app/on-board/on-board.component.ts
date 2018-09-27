import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { TranslatableField } from '../models/fields/translatable';

@Component({
  selector: 'app-on-board',
  templateUrl: './on-board.component.html',
  styleUrls: ['./on-board.component.css']
})
export class OnBoardComponent implements OnInit {
  @Input() accummulations: Object;

  onBoard: OnBoard;

  hasAddedMoney = false;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$<OnBoard>('onBoardService').subscribe(collection => {
      this.onBoard = collection[0];
      console.log('onboard amount', this.onBoard.amount);

      console.log('total amount', this.accummulations['totalPriceAmount']);

      if (this.accummulations['hasUpsell']) {
        this.yes();
      }
    });

  }

  yes() {
    this.accummulations['hasUpsell'] = true;
    this.accummulations['upsellPrice'] = this.onBoard.amount;

    this.accummulations['totalPriceAmount'] = this.accummulations['totalPriceAmount'] + +this.onBoard.amount;
    this.accummulations['totalPrice'] = 'CHF ' + this.accummulations['totalPriceAmount'];
    this.hasAddedMoney = true;
    console.log('total amount', this.accummulations['totalPriceAmount']);
  }

  no() {
    this.accummulations['hasUpsell'] = false;
    this.accummulations['upsellPrice'] = 0;

    if (this.hasAddedMoney) {
      this.hasAddedMoney = false;

      this.accummulations['totalPriceAmount'] -= this.onBoard.amount;
      this.accummulations['totalPrice'] = 'CHF ' + this.accummulations['totalPriceAmount'];
      console.log('total amount', this.accummulations['totalPriceAmount']);
    }
  }

}

interface OnBoard {
  active: boolean;
  name: TranslatableField;
  description: TranslatableField;
  currency: string;
  amount: number;
}

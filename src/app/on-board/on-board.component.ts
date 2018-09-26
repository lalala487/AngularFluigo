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

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {
    this.db.colWithIds$('onBoardService').subscribe(collection => {
      console.log('col', collection);
      this.onBoard = collection[0];
    });

  }

  yes() {
    this.accummulations['hasUpsell'] = true;
    this.accummulations['champagnePrice'] = this.onBoard.amount;

    console.log('hasUpsell', this.accummulations['hasUpsell']);
  }

  no() {
    this.accummulations['hasUpsell'] = false;
    this.accummulations['champagnePrice'] = 0;
    console.log('hasUpsell', this.accummulations['hasUpsell']);
  }

}

interface OnBoard {
  active: boolean;
  name: TranslatableField;
  description: TranslatableField;
  currency: string;
  amount: number;
}

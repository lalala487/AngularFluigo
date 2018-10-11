import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { TranslatableField } from '../models/fields/translatable';
import { Money, Currencies } from 'ts-money';
import { Deal } from '../models/deal';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.css']
})
export class TransportationComponent implements OnInit {
  @Input() hasTransportation: boolean;
  @Input() transportationPrice: Money;

  @Input() deal: Deal;

  @Output() hasTransportationChange: EventEmitter<boolean> = new EventEmitter();
  @Output() transportationPriceChange: EventEmitter<Money> = new EventEmitter();

  transportation: Ride;
  transportationMessage: string;

  constructor(
    protected db: FirestoreService
  ) {

  }

  ngOnInit(): void {

    const dealRride = this.deal.ride;
    console.log('ride', dealRride);

    this.db.doc$<Ride>('/ride/' + dealRride.id).subscribe(ride => {
      this.transportation = ride as Ride;

      this.transportationPrice = Money.fromDecimal(this.transportation.amount, Currencies.CHF, Math.ceil);
      this.transportationPriceChange.emit(this.transportationPrice);

      this.transportationMessage = ride.name.de_CH.replace(
        'xxx',
        this.transportationPrice.currency + ' ' + this.transportationPrice.toString()
      );

      if (this.hasTransportation) {
        this.yes();
      }
    });
  }

  yes() {
    this.hasTransportation = true;
    this.hasTransportationChange.emit(this.hasTransportation);
  }

  no() {
    this.hasTransportation = false;
    this.hasTransportationChange.emit(this.hasTransportation);
  }

}

interface Ride {
  active: boolean;
  name: TranslatableField;
  description: TranslatableField;
  currency: string;
  amount: number;
}

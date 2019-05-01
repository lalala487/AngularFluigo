import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Money, Currencies } from 'ts-money';
import { Deal } from '../models/deal';
import { Ride } from '../models/ride';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

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

  locale = environment.locale;

  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    const dealRide: DocumentReference = this.deal.ride;
    console.log('ride', dealRide);

    this.db.doc<Ride>(dealRide.path).valueChanges().subscribe(ride => {
      this.transportation = ride;

      this.transportationPrice = Money.fromDecimal(this.transportation.amount, Currencies.CHF, Math.ceil);
      this.transportationPriceChange.emit(this.transportationPrice);

      this.transportationMessage = ride.name[this.locale].replace(
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

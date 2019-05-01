import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Airport } from '../models/airport';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrls: ['./airport-list.component.css']
})
export class AirportListComponent implements OnInit {
  airports: Array<Observable<Airport>>;

  @Input() selectedAirport;
  @Input() dbAirports: Array<DocumentReference>;

  @Output() selectedAirportChange: EventEmitter<Airport> = new EventEmitter();

  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.airports = this.dbAirports.map(airport => {
      return this.db.doc(airport.path).snapshotChanges().pipe(
        map(action => {
          const data = action.payload.data() as Airport;
          const id = action.payload.id;

          const air = { id, ...data };

          return air;
        })
      );
    });
  }

  compareFn(a, b) {
    return a && b && a.value === b.value;
  }

  onChange(newValue) {
    this.selectedAirport = newValue;

    this.selectedAirportChange.emit(this.selectedAirport);
  }

}

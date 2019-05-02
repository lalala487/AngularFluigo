import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { Room } from '../models/room';
import { Observable } from 'rxjs';
import { Accommodation } from '../models/accommodation';

@Component({
  selector: 'app-user-quantity',
  templateUrl: './user-quantity.component.html',
  styleUrls: ['./user-quantity.component.css']
})
export class UserQuantityComponent implements OnInit, OnChanges {
  @Input() childrenNumber: number;
  @Input() adultNumber: number;
  @Input() accommodation: Accommodation;

  room$: Observable<Room>;

  @Output() childrenNumberChange: EventEmitter<any> = new EventEmitter();
  @Output() adultNumberChange: EventEmitter<any> = new EventEmitter();

  onChildrenChange(value) {
    this.childrenNumber = value;

    this.childrenNumberChange.emit(this.childrenNumber);
  }

  onAdultChange(value) {
    this.adultNumber = value;

    this.adultNumberChange.emit(this.adultNumber);
  }

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    const room = this.accommodation ? this.accommodation.rooms[0] : undefined;

    if (room) {
      this.room$ = this.db.doc<Room>(room.path).valueChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const accommodation: SimpleChange = changes.accommodation;

    if (!accommodation) {
      return;
    }

    this.accommodation = accommodation.currentValue as Accommodation;

    const room = this.accommodation ? this.accommodation.rooms[0] : undefined;

    console.log('accommodation', this.accommodation, 'room', room);

    if (room) {
      this.room$ = this.db.doc<Room>(room.path).valueChanges();
    }
  }

}

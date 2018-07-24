import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Birthday } from '../models/birthday';

@Component({
  selector: 'app-ages-children',
  templateUrl: './ages-children.component.html',
  styleUrls: ['./ages-children.component.css']
})
export class AgesChildrenComponent implements OnChanges {
  @Input() childrenNumber: number;
  @Input() childrenBirthdays: Array<Birthday>;
  @Input() accummulations: Object;

  @Output() childrenBirthdaysChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const childrenNumber: SimpleChange = changes.childrenNumber;

    if (childrenNumber !== undefined) {
      this.childrenNumber = childrenNumber.currentValue as number;

      if (this.childrenNumber >= 1) {
        const birth = {'day': 1, 'month': 1, 'year': 2018} as Birthday;
        this.childrenBirthdaysChange.emit(this.childrenBirthdays);
        this.childrenBirthdays = Array(this.childrenNumber).fill(birth);
      }
    }
  }

}

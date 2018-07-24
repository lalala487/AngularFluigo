import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-ages-children',
  templateUrl: './ages-children.component.html',
  styleUrls: ['./ages-children.component.css']
})
export class AgesChildrenComponent implements OnChanges {
  @Input() childrenNumber: number;
  @Input() childrenBirthdays: Array<any>;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const childrenNumber: SimpleChange = changes.childrenNumber;

    if (childrenNumber !== undefined) {
      this.childrenNumber = childrenNumber.currentValue as number;

      if (this.childrenNumber >= 1) {
        this.childrenBirthdays = Array(this.childrenNumber);
      }
    }
  }

}

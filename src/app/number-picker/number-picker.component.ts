import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.css']
})
export class NumberPickerComponent {
  @Output() numberChange: EventEmitter<number> = new EventEmitter();

  @Input() currentNumber: number;
  @Input() maxNumber = 1;
  @Input() minNumber = 6;

  constructor() { }

  increaseNumber() {
    if (this.currentNumber < this.maxNumber) {
      this.currentNumber++;
      this.numberChange.emit(this.currentNumber);
    }
  }

  decreaseNumber() {
    if (this.currentNumber > this.minNumber) {
      this.currentNumber--;
      this.numberChange.emit(this.currentNumber);
    }
  }
}

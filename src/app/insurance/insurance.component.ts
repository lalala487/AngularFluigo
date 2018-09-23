import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent {
  @Input() accummulations: Object;

  onClickMe() {
    this.accummulations['hasInsurance'] = !this.accummulations['hasInsurance'];
  }
}

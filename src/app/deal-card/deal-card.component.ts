import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-deal-card',
  templateUrl: './deal-card.component.html',
  styleUrls: ['./deal-card.component.css']
})
export class DealCardComponent {
  @Input() deal: any;
}

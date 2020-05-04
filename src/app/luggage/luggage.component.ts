import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-luggage',
  templateUrl: './luggage.component.html',
  styleUrls: ['./luggage.component.css']
})
export class LuggageComponent implements OnInit {
  @Input() luggage: number;

  @Output() luggageChange: EventEmitter<number> = new EventEmitter();

  constructor(
    public ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit(): void {
    this.luggageChange.emit(this.luggage);
  }

  onLuggageChange(value) {
    this.luggage = value;

    this.luggageChange.emit(this.luggage);
  }
}

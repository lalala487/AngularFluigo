import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-age',
  templateUrl: './user-age.component.html',
  styleUrls: ['./user-age.component.css']
})
export class UserAgeComponent implements OnInit {
  @Input() hasChildren: boolean;
  @Output() hasChildrenChange: EventEmitter<boolean> = new EventEmitter();

  selectHasChildren(hasChildren: boolean) {
    this.hasChildren = hasChildren;

    this.hasChildrenChange.emit(this.hasChildren);
  }

  constructor() { }

  ngOnInit() {
  }

}

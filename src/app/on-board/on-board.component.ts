import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-on-board',
  templateUrl: './on-board.component.html',
  styleUrls: ['./on-board.component.css']
})
export class OnBoardComponent implements OnInit {
  @Input() accummulations: Object;

  ngOnInit(): void {
  }

  onClickMe() {
    this.accummulations['hasChampagne'] = !this.accummulations['hasChampagne'];
  }

}

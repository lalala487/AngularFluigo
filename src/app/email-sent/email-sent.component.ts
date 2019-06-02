import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.css']
})
export class EmailSentComponent implements OnInit {
  @Input() showContentLanding = false;

  constructor() { }

  ngOnInit() {
  }

}

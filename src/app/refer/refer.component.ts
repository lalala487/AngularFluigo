import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-travel-guide-list',
  templateUrl: './travel-guide-list.component.html',
  styleUrls: ['./travel-guide-list.component.css']
})
export class TravelGuideListComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

}

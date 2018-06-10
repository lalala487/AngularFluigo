import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  deals: Observable<any[]>;

  constructor(protected db: FirestoreService) {
    // this.items = db.collection('flight').valueChanges();
  }

  ngOnInit() {
    this.deals = this.db.col$('deal');
  }

}

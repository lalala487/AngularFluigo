import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserContact } from '../models/user-contact';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInfo } from '../models/user-info';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @Input() user: UserContact;
  @Output() userContactChange: EventEmitter<UserContact> = new EventEmitter();

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {

    this.afAuth.user.subscribe(user => {
      this.user.email = user.email;

      this.db.doc<UserInfo>(`users/${user.uid}`).valueChanges().subscribe(userInfo => {
        if (userInfo.name) {
          this.user.firstName = userInfo.name.first;
          this.user.lastName = userInfo.name.last;
        }

        if (userInfo.contact && userInfo.contact.phone) {
          this.user.phoneNumber = userInfo.contact.phone.home;
        }
      });
    });
  }
}

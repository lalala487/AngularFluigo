import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../models/user';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @Input() user: User;
  @Output() userContactChange: EventEmitter<User> = new EventEmitter();

  constructor(
    protected db: FirestoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getLoggedUser().subscribe(innerUser => {
      this.user.email = innerUser.email;
      this.db.doc$('users/' + innerUser.uid).subscribe(fullUser => {

        this.user = Object.assign({}, fullUser['contact']);

        this.userContactChange.emit(this.user);
      });
    });
  }

}

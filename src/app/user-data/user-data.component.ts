import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { switchMap } from 'rxjs/operator/switchMap';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @Input() user: User;

  constructor(
    protected db: FirestoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getLoggedUser().subscribe(innerUser => {
      this.user.email = innerUser.email;
    });
  }

}

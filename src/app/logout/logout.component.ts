import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.afAuth.signOut();

    this.router.navigate(['/']);
  }

}

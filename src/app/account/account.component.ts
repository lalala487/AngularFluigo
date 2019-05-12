import { Component, OnInit } from '@angular/core';
import { UserContact } from '../models/user-contact';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from '../models/user-info';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SendgridService } from '../services/sendgrid.service';
import { StripeCustomerService } from '../services/stripe-customer.service';
import * as firebase from 'firebase/app';
import { OrderTimestamps } from '../models/order';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userContact: UserContact;
  selectedOrder: OrderTimestamps;

  email: string;
  emailChangedError = false;

  currentPage: string;
  defaultPage = 'profile';

  availablePages = {
    profile: 1,
    orders: 1,
    data: 1,
    documents: 1
  };

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
    private sendGridService: SendgridService,
    private stripeCustomerService: StripeCustomerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const page = params.get('page') || this.defaultPage;

      if (this.availablePages[page]) {
        this.currentPage = page;
      } else {
        this.router.navigate(['/account']);
      }

      this.afAuth.user.subscribe(user => {
        if (!user) {
          return;
        }
        this.email = user.email;
        this.userContact = {
          email: user.email,
          uid: user.uid
        } as UserContact;

        this.db.doc<UserInfo>(`users/${user.uid}`).valueChanges().subscribe(userInfo => {
          if (userInfo.name) {
            this.userContact.firstName = userInfo.name.first;
            this.userContact.lastName = userInfo.name.last;
          }

          if (userInfo.contact && userInfo.contact.phone) {
            this.userContact.phoneNumber = userInfo.contact.phone.home;
          }

          const url = this.router.url;
          if (this.afAuth.auth.isSignInWithEmailLink(url)) {
            this.confirmSignIn(url);
          }
        });
      });
    });
  }

  changeTo(page) {
    this.currentPage = page;
  }

  confirmSignIn(url) {
    const oldEmail = window.localStorage.getItem('userOldEmail');

    const credential = firebase.auth.EmailAuthProvider.credentialWithLink(
      oldEmail, url
    );

    this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then((userCred) => {
      const newEmail = window.localStorage.getItem('userNewEmail');
      if (newEmail) {
        this.updateEmail(newEmail, oldEmail);
      }

      const isDeletion = window.localStorage.getItem('isDeletion');
      if (isDeletion) {
        this.afAuth.auth.currentUser.delete().then(() => {
          this.toastr.success('Benutzer erfolgreich entfernt');

          window.localStorage.removeItem('idDeletion');

          this.router.navigate(['/home']);

        }).catch(err => {
          this.toastr.error('Unmöglich Benutzer zu entfernen');
        });
      }
    });
  }

  private updateEmail(newEmail: string, oldEmail: string) {
    this.afAuth.auth.currentUser.updateEmail(newEmail).then(() => {
      this.sendGridService.updateSendGridContact(newEmail, oldEmail).subscribe(data => {
      });
      this.userContact.email = newEmail;
      const userRef = this.db.doc(`users/${this.userContact.uid}`);
      userRef.set({
        contact: {
          email: newEmail
        }
      }, { merge: true });
      this.stripeCustomerService.updateStripeContact(newEmail).subscribe(data => {
      });
      const redirectUrl = window.localStorage.getItem('redirectUrl');
      this.router.navigate([redirectUrl]);
      this.toastr.success('E-Mail verändert in ' + newEmail);

      window.localStorage.removeItem('redirectUrl');
      window.localStorage.removeItem('userNewEmail');
      window.localStorage.removeItem('userOldEmail');
    }).catch(err => {
      this.emailChangedError = true;
    });
  }

  userContactChange(userContact: UserContact) {
    const data = {
      name: {
        first: userContact.firstName,
        last: userContact.lastName
      },
      contact: {
        email: userContact.email,
        phone: {
          home: userContact.phoneNumber
        }
      },
    };

    if (userContact.email !== this.email) {
      window.localStorage.setItem('userNewEmail', this.userContact.email);
      window.localStorage.setItem('userOldEmail', this.email);
      this.sendEmailLink(environment.reAuthSettings);
      this.toastr.info('Sie müssen sich erneut authentifizieren');

      data.contact.email = this.email;
    }

    if (!this.emailChangedError) {
      const userRef = this.db.doc(`users/${this.userContact.uid}`);
      userRef.set(data, { merge: true });

      this.toastr.success('Wir haben die Daten bei uns angepasst');

      this.sendGridService.updateSendGridContact(this.email).subscribe(dat => {
      });
    }
  }

  deleteUserChange(email: string) {
    if (email === this.email) {
      this.toastr.info('Du hast eine E-Mail bekommen');
      window.localStorage.setItem('isDeletion', '1');
      this.sendEmailLink(environment.reAuthSettingForData);
    } else {
      this.toastr.error('Ist die E-Mail richtig geschrieben?');
    }
  }

  async sendEmailLink(settings) {
    try {
      await this.afAuth.auth.sendSignInLinkToEmail(
        this.email,
        settings
      );

      const url = this.router.url;
      window.localStorage.setItem('emailForSignIn', this.email);
      window.localStorage.setItem('redirectUrl', url);
    } catch (error) {
      this.toastr.error('Konnte E-Mail nicht schicken');
    }
  }

  orderDocumentSelected(order: OrderTimestamps) {
    this.selectedOrder = order;
    this.currentPage = 'documents';
  }

}

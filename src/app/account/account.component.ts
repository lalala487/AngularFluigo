import { Component, OnInit } from '@angular/core';
import { UserContact } from '../models/user-contact';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from '../models/user-info';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { SendgridService } from '../services/sendgrid.service';
import { StripeCustomerService } from '../services/stripe-customer.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userContact: UserContact;

  email: string;
  emailChangedError = false;

  currentPage: string;
  defaultPage = 'profile';

  availablePages = {
    profile: 1,
    data: 1
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
      console.log('page', page);

      if (this.availablePages[page]) {
        this.currentPage = page;
      } else {
        this.router.navigate(['/account']);
      }

      console.log('page', page, 'currentPage', this.currentPage);

      this.afAuth.user.subscribe(user => {
        console.log('user', user);
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

          console.log('init user contact', userInfo);

          const url = this.router.url;
          console.log('url', url);
          if (this.afAuth.auth.isSignInWithEmailLink(url)) {
            this.confirmSignIn(url);
          }
        });
      });
    });
  }

  changeTo(page) {
    this.currentPage = page;
    console.log('current Page', this.currentPage);
  }

  confirmSignIn(url) {
    const oldEmail = window.localStorage.getItem('userOldEmail');

    console.log('confirmSignIn');
    const credential = firebase.auth.EmailAuthProvider.credentialWithLink(
      oldEmail, url
    );

    console.log('credential', credential);

    this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then((userCred) => {
      const newEmail = window.localStorage.getItem('userNewEmail');
      if (newEmail) {
        this.updateEmail(newEmail, oldEmail);
      }

      const isDeletion = window.localStorage.getItem('isDeletion');
      if (isDeletion) {
        this.afAuth.auth.currentUser.delete().then(() => {
          this.toastr.success('User delete successfully');

          window.localStorage.removeItem('idDeletion');

          this.router.navigate(['/home']);

        }).catch(err => {
          console.log('couldnt delete user', err);
          this.toastr.error('Coult not delete user');
        });
      }
    });
  }

  private updateEmail(newEmail: string, oldEmail: string) {
    this.afAuth.auth.currentUser.updateEmail(newEmail).then(() => {
      console.log('email updated to ', newEmail);
      this.sendGridService.updateSendGridContact(newEmail, oldEmail).subscribe(data => {
        console.log('data', data);
      });
      this.userContact.email = newEmail;
      const userRef = this.db.doc(`users/${this.userContact.uid}`);
      userRef.set({
        contact: {
          email: newEmail
        }
      }, { merge: true });
      this.stripeCustomerService.updateStripeContact(newEmail).subscribe(data => {
        console.log('output from stripe customer service');
      });
      const redirectUrl = window.localStorage.getItem('redirectUrl');
      this.router.navigate([redirectUrl]);
      this.toastr.success('Email updated to ' + newEmail);

      window.localStorage.removeItem('redirectUrl');
      window.localStorage.removeItem('userNewEmail');
      window.localStorage.removeItem('userOldEmail');
    }).catch(err => {
      console.log('couldnt update email', err);
      this.emailChangedError = true;
    });
  }

  userContactChange(userContact: UserContact) {
    console.log('userContactChange');
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
      this.toastr.info('You need to re-authenticate to change your email. An email was sent to you in order to do that.');

      data.contact.email = this.email;
    }

    if (!this.emailChangedError) {
      const userRef = this.db.doc(`users/${this.userContact.uid}`);
      userRef.set(data, { merge: true });

      this.toastr.success('User data updated');

      this.sendGridService.updateSendGridContact(this.email).subscribe(dat => {
        console.log('data', dat);
      });
    }
  }

  deleteUserChange(email: string) {
    if (email === this.email) {
      console.log('delete account');

      this.toastr.info(
        'You need to re-authenticate to delete your email. An email was sent to you in order to do that.'
      );

      window.localStorage.setItem('isDeletion', '1');
      this.sendEmailLink(environment.reAuthSettingForData);
    } else {
      this.toastr.error(
        'You supplied a wrong email address. Account will not be deleted'
      );
    }
  }

  async sendEmailLink(settings) {
    try {
      await this.afAuth.auth.sendSignInLinkToEmail(
        this.email,
        settings
      );

      const url = this.router.url;
      console.log('url', url);
      window.localStorage.setItem('emailForSignIn', this.email);
      window.localStorage.setItem('redirectUrl', url);

      console.log('emitting email sent');

    } catch (error) {
      console.log('error', error);
    }
  }

}

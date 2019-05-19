import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-account-order-document-list-item',
  templateUrl: './account-order-document-list-item.component.html',
  styleUrls: ['./account-order-document-list-item.component.css']
})
export class AccountOrderDocumentListItemComponent implements OnInit {
  @Input() document: string;

  url;

  constructor(
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    const ref = this.storage.ref(this.document);

    ref.getDownloadURL().subscribe(url => this.url = url);
  }

}

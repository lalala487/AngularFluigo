import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable()
export class CollectionsService {

  constructor(
    private db: FirestoreService,
  ) { }

  getCollection<T>(items: Array<any>): Array<T> {
    const allItems = [];
    items.forEach(element => {
      const itemRef = this.db.doc<any>(element.path);

      itemRef.valueChanges().subscribe(
        item => {
          item.id = itemRef.ref.id;
          if (item) {
            allItems.push(item as T);
          }
        }
      );
    });

    return allItems;
  }


}

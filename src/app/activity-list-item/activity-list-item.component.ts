import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Activity } from '../models/activity';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { ActivityService } from '../models/activity-service';

@Component({
  selector: 'app-activity-list-item',
  templateUrl: './activity-list-item.component.html',
  styleUrls: ['./activity-list-item.component.css']
})
export class ActivityListItemComponent implements OnInit {

  @Input() activity: Observable<Activity>;
  @Output() activitySelected: EventEmitter<Activity> = new EventEmitter();

  locale = environment.locale;

  activityItem: Activity;
  imageUrl: SafeStyle;

  hasSkipLine = false;

  constructor(
    private db: AngularFirestore,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    this.activity.subscribe(value => {
      this.activityItem = value;

      const image = this.activityItem ? this.activityItem.image.main : undefined;

      if (image) {
        this.imageService.getImageDownloadUrl$(image).subscribe(
          url => this.imageUrl = this.imageService.sanitizeImage(url)
        );
      }

      const activityServices: Array<DocumentReference> = this.activityItem.services;

      activityServices.map(
        activityService => this.db.doc<ActivityService>(activityService.path).valueChanges().subscribe(service => {
          if (service.name.en_GB === 'Skip the line') {
            this.hasSkipLine = true;
          }
        })
      );

    });
  }

  chooseActivity() {
    this.activitySelected.emit(this.activityItem);
  }

}

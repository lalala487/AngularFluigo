import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ScheduleDAy } from '../models/guide-schedule-field';
import { environment } from 'src/environments/environment';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-guide-day-schedule',
  templateUrl: './guide-day-schedule.component.html',
  styleUrls: ['./guide-day-schedule.component.css']
})
export class GuideDayScheduleComponent implements OnInit, OnChanges {
  locale = environment.locale;
  imageUrl: SafeStyle;

  @Input() guideScheduleDay: ScheduleDAy;
  @Input() day: string;

  constructor(
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    const image = this.guideScheduleDay ? this.guideScheduleDay.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.imageUrl = this.imageService.sanitizeImage(url);
        }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const guideScheduleDay: SimpleChange = changes.guideScheduleDay;

    if (!guideScheduleDay.currentValue) {
      return;
    }

    this.guideScheduleDay = guideScheduleDay.currentValue as ScheduleDAy;

    const image = this.guideScheduleDay ? this.guideScheduleDay.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.imageUrl = this.imageService.sanitizeImage(url);
        }
      );
    }

  }

}

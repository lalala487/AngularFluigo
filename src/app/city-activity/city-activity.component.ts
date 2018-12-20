import { Component, OnInit, Input } from '@angular/core';
import { CityActivity } from '../models/city-activity';
import { environment } from '../../environments/environment';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-city-activity',
  templateUrl: './city-activity.component.html',
  styleUrls: ['./city-activity.component.css']
})
export class CityActivityComponent implements OnInit {
  @Input() activity: CityActivity;
  imageUrl: SafeStyle;
  locale = environment.locale;

  constructor(
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    const image = this.activity ? this.activity.image.main : undefined;

    if (image) {
      this.imageService.getImageDownloadUrl$(image).subscribe(
        url => {
          this.imageUrl = this.imageService.sanitizeImage(url);
        }
      );
    }
  }

}

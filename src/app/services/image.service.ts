import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Injectable()
export class ImageService {
  constructor(protected storage: AngularFireStorage, protected sanitizer: DomSanitizer) { }

  getImageDownloadUrl$(image: string): any {
    const ref = this.storage.ref(image);

    return ref.getDownloadURL();
  }

  sanitizeImage(img) {
    return this.sanitizer.bypassSecurityTrustStyle('url(' + img + ')');
  }

}

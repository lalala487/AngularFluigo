import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(protected storage: AngularFireStorage, protected sanitizer: DomSanitizer) { }

  getImageDownloadUrl$(image: string): any {
    const ref = this.storage.ref(image);

    return ref.getDownloadURL();
  }

  sanitizeImage(image: string) {
    return this.sanitizer.bypassSecurityTrustStyle('url(' + image + ')');
  }

  sanitizeUrl(image: string) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }
}

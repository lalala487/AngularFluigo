import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(protected storage: AngularFireStorage, protected sanitizer: DomSanitizer) { }

  getImageDownloadUrl$(image: string): Observable<string> {
    const ref = this.storage.ref(image);

    return ref.getDownloadURL();
  }

  sanitizeImage(image: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle('url(' + image + ')');
  }

  sanitizeUrl(image: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }

  getImageDownloadSanitizedStyle$(image: string): Observable<SafeUrl> {
    return this.getImageDownloadUrl$(image).pipe(map(url => this.sanitizeImage(url)));
  }
}

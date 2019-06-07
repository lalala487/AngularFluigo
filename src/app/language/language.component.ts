import { Component, Input } from '@angular/core';
import { Language } from '../models/language';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent {
  @Input() language: Observable<Language>;

  locale = environment.locale;
}

import { Component, OnInit, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Accummulation } from '../models/fields/accummulation';
import { SafeStyle } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Airline } from '../models/airline';
import { FlightOffer } from '../models/flight-offer';
import { FlightFare } from '../models/flight-fare';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-luggage-detail',
  templateUrl: './luggage-detail.component.html',
  styleUrls: ['./luggage-detail.component.css']
})
export class LuggageDetailComponent implements OnInit {
  @Input() accummulations: Accummulation;
  imageUrl: SafeStyle;
  logoUrl: SafeStyle;

  flightFare: Observable<FlightFare>;

  airlineName: string;

  locale = environment.locale;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private imageService: ImageService,
    private db: AngularFirestore,
  ) { }

  ngOnInit(): void {
    const flight = this.accummulations ? this.accummulations.event.meta.way.flight : null;

    const flightOfferId = this.accummulations ? this.accummulations.event.meta.way.flightOfferId : null;

    this.db.doc<FlightOffer>('flightOffer/' + flightOfferId).valueChanges().subscribe(offer => {
      const fareRef = offer.flightFare[0];

      this.flightFare = this.db.doc<FlightFare>(fareRef.path).valueChanges();
    });


    if (flight) {
      const airlineRef = flight.airline[0];

      this.db.doc<Airline>(airlineRef.path).valueChanges().subscribe(airline => {
        this.airlineName = airline.name[this.locale];

        if (airline.background) {
          this.imageService.getImageDownloadUrl$(airline.background.main).subscribe(
            url => this.imageUrl = this.imageService.sanitizeImage(url)
          );
        }

        if (airline.logo) {
          this.imageService.getImageDownloadUrl$(airline.logo.main).subscribe(
            url => this.logoUrl = this.imageService.sanitizeImage(url)
          );
        }
      });
    }

  }

}

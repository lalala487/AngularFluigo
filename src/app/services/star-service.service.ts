import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarServiceService {
  constructor() { }

  getStarInformation(rating: number, maxRating: number): [number, Array<number>, Array<number>] {
    const starFillingPercentage: number = this.getStarFillingPercentage(rating);
    let fullStars: Array<number> = [];
    let emptyStars: Array<number> = [];


    if (rating >= 1) {
      fullStars = Array(Math.floor(rating));
    }

    if (fullStars.length !== 5) {
      emptyStars = Array(Math.floor(maxRating - (fullStars.length + 1)));
    }

    return [starFillingPercentage, fullStars, emptyStars];
  }

  private getStarFillingPercentage(rating: number): number {
    return Number(((rating - Math.floor(rating)) * 10).toFixed(0));
  }
}

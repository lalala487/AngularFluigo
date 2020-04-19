import { Component, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Grading } from '../models/grading';
import { environment } from 'src/environments/environment';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
}

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.css']
})

export class GradingComponent implements OnChanges {
  @Input() grading: Array<Grading>;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;


  locale = environment.locale;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Series 1',
          data: [80, 50, 30, 40, 100, 20]
        }
      ],
      chart: {
        height: 350,
        type: 'radar'
      },
      title: {
        text: 'Basic Radar Chart'
      },
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June']
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change: SimpleChange = changes.grading;

    if (!change.currentValue) {
      return;
    }

    const gradings: Array<Grading> = change.currentValue;

    const data = [];

    const names = gradings.map(grading => grading.name[this.locale]);
    const ratings = gradings.map(grading => grading.rating);


    this.chartOptions.xaxis.categories = names;

    this.chartOptions.series = [
      {
        name: 'Ratings',
        data: ratings
      }
    ];
  }
}

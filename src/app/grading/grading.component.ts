import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Grading } from '../models/grading';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.css']
})

export class GradingComponent implements OnChanges {
  @Input() grading: Array<Grading>;

  locale = environment.locale;

  // Radar
  public radarChartOptions: RadialChartOptions = {
    tooltips: {
      displayColors: false,
      backgroundColor: 'rgba(235, 235, 235, 1)',
      bodyFontStyle: 'normal',
      bodyFontColor: 'rgba(19, 78, 94, 1)',
      bodyFontFamily: '\'Roboto\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
      bodyFontSize: 16,
      xPadding: 14,
      yPadding: 14,
      callbacks: {
        label: function (tooltipItem) {
          return Number(tooltipItem.yLabel) + '';
        },
        title: function () {
          return '';
        }
      }
    },
    scale: {
      angleLines: {
        color: 'rgba(235, 235, 235, .25)',
        lineWidth: 2
      },
      gridLines: {
        color: 'rgba(235, 235, 235, .25)',
        lineWidth: 2
      },
      pointLabels: {
        fontColor: 'rgba(235, 235, 235, 1)',
        fontFamily: '\'Roboto\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
        fontSize: 16
      },
      ticks: {
        showLabelBackdrop: false,
        display: false,
        stepSize: 2,
        min: 6,
        max: 10,
        fontColor: 'rgba(235, 235, 235, 1)',
        fontFamily: '\'Roboto\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
        fontSize: 16
      }
    },
    responsive: true,
  };
  public radarChartLabels: Label[] = [];

  public radarChartData: ChartDataSets[];

  public radarChartLegend = false;

  public radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const change: SimpleChange = changes.grading;

    if (!change.currentValue) {
      return;
    }

    const gradings: Array<Grading> = change.currentValue;

    const data = [];
    for (const grading of gradings) {
      this.radarChartLabels.push(grading.name[this.locale]);
      data.push(grading.rating);
    }

    this.radarChartData = [
      {
        data: data,
        borderColor: 'rgba(235, 235, 235, .75)',
        backgroundColor: 'rgba(235, 235, 235, .2)',
        pointBorderColor: 'rgba(235, 235, 235, 1)',
        pointBackgroundColor: 'rgba(235, 235, 235, 1)',
        pointBorderWidth: 0,
        pointHoverBorderColor: 'rgba(235, 235, 235, 1)',
        pointHoverRadius: 2
      }
    ];
  }
}

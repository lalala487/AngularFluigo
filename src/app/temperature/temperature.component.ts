import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { Temperature } from '../models/temperature';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnChanges {
  @Input() temperature: Array<Temperature>;

  constructor() { }
  public lineChartOptions = {
    scaleShowVerticalLines: false,
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
        label: function (tooltipItem, data) {
          return tooltipItem.yLabel + ' Grad';
        },
        title: function (tooltipItem, data) {
          return;
        }
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false,
          fontSize: 14,
          fontColor: 'rgba(235, 235, 235, 0.5)'
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
          stepSize: 10,
          suggestedMin: 0,
          fontSize: 14,
          fontColor: 'rgba(235, 235, 235, 0.5)'
        }
      }]
    },
    responsive: true,
  };
  public lineChartLabels = ['Januar', '', '', '', '', '', '', '', '', '', '', 'Dezember'];
  public lineChartType = 'line';
  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Temperature',
      borderColor: 'rgba(235, 235, 235, .75)',
      backgroundColor: 'rgba(235, 235, 235, .2)',
      pointBorderColor: 'rgba(235, 235, 235, 1)',
      pointBackgroundColor: 'rgba(235, 235, 235, 1)',
      pointBorderWidth: 0,
      pointHoverBorderColor: 'rgba(235, 235, 235, 1)',
      pointHoverRadius: 2
    }
  ];
  public lineChartLegend = false;

  ngOnChanges(changes: SimpleChanges) {
    const temperature: SimpleChange = changes.temperature;

    if (temperature) {
      this.temperature = temperature.currentValue as Temperature[];

      if (!this.temperature) {
        return;
      }

      const months = this.temperature.map(temp => temp.month);
      const temperatures = this.temperature.map(temp => temp.temperature);

      this.lineChartLabels = months;
      this.lineChartData[0].data = temperatures;

    }
  }

}

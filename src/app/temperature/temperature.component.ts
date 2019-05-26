import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnInit {

  constructor() { }
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    tooltips: {
      displayColors: false,
      backgroundColor: 'rgba(235, 235, 235, 1)',
      bodyFontStyle: 'normal',
      bodyFontColor: 'rgba(19, 78, 94, 1)',
      bodyFontFamily: '\'Roboto\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
      bodyFontSize: 14,
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
  public lineChartData = [
    {
      data: [8, 12, 13, 16, 18, 24, 25, 20, 15, 11, 5, 4],
      label: 'Temperature',
      borderColor: 'rgba(235, 235, 235, .75)',
      backgroundColor: 'rgba(235, 235, 235, .2)',
      pointBorderColor: 'rgba(235, 235, 235, 1)',
      pointBackgroundColor: 'rgba(235, 235, 235, 1)',
      pointBorderWidth: 0,
      pointHoverBorderColor: 'rgba(235, 235, 235, 1)',
      pointHoverRadius: 2
    },

  ];
  public lineChartLegend = false;

  ngOnInit() {
  }

}

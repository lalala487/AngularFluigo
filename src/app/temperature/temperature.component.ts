import { Component, Input, SimpleChanges, SimpleChange, OnChanges, ViewChild } from '@angular/core';
import { Temperature } from '../models/temperature';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexFill,
  ApexMarkers,
  ApexTooltip,
  ApexGrid
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnChanges {
  @Input() temperature: Array<Temperature>;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
      ],
      chart: {
        height: 450,
        type: 'area',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
      },
      markers: {
        size: 0,
        colors: ['rgba(235,235,235,1)'],
        strokeWidth: 0,
      },
      fill: {
        colors: ['rgba(235,235,235,.15)'],
        type: 'solid'
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        colors: ['rgba(235,235,235,.75)'],
        width: 3
      },
      tooltip: {
        enabled: true,
        marker: {
          show: false,
        }
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
        tooltip: {
          enabled: false,
        }
      },
      yaxis: {
        crosshairs: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        }
      }
    };
  }

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

      this.chartOptions.xaxis.categories = months;

      this.chartOptions.series = [
        {
          name: 'Temperature',
          data: temperatures
        }
      ];

    }
  }
}

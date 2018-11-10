import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public chartLabels = ['Gold', 'Silver', 'USD', 'AUD'];
  public chartData = [100, 150, 130, 500];
  public chartType = 'line';

  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Gold' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Silver' },
    { data: [23, 38, 48, 89, 26, 67, 20], label: 'USD' },
    { data: [18, 48, 77, 9, 100, 27, 40], label: 'AUD' }
  ];
  // public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartLabels: Array<any> = [1, 2, 3, 4, 5, 6, 7];
  public lineChartOptions: any = {
    responsive: true,
    bezierCurve: false
  };
  public lineChartColors: Array<any> = [
    { // Gold
      backgroundColor: 'rgba(255, 223, 0, 0.2)',
      borderColor: 'rgba(255, 223, 0)',
      pointBackgroundColor: 'rgba(255, 223, 0)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 223, 0, 0.8)'
    },
    { // Silver
      backgroundColor: 'rgba(211, 211, 211, 0.2)',
      borderColor: 'rgba(211, 211, 211)',
      pointBackgroundColor: 'rgba(211, 211, 211)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(211, 211, 211, 0.8)'
    },
    { // USD
      backgroundColor: 'rgba(133, 187, 101, 0.2)',
      borderColor: 'rgba(133, 187, 101)',
      pointBackgroundColor: 'rgba(133, 187, 101)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(133, 187, 101, 0.8)'
    },
    { // AUD
      backgroundColor: 'rgba(1, 33, 105, 0.2)',
      borderColor: 'rgba(1, 33, 105)',
      pointBackgroundColor: 'rgba(1, 33, 105)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(1, 33, 105, 0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  constructor(public navCtrl: NavController) {

  }


  randomize(): void {
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }


}

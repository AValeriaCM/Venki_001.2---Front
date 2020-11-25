import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  dataStats = [];
  myChart;
  usertk;
  constructor(
    private auth: AuthService,
    private log: LoginService,
  ) { }

  ngOnInit() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
        this.dataStats = [infoUser.cognitivo, infoUser.emocional, infoUser.conductual, infoUser.fortaleza_mental];
        this.chartGraf();
      });
    });
    
  }

  chartGraf(){

    const chartColors = {
      default: 'rgba(163, 163, 163, 0.2)',
      red: 'rgba(255, 99, 132, 0.2)',
      blue: 'rgba(54, 162, 235, 0.2)',
      green: 'rgba(23, 165, 47, 0.2)'
    };

    const chartColorsBorder = {
      default: 'rgba(163, 163, 163, 1)',
      red:  'rgba(255, 99, 132, 1)',
      blue: 'rgba(54, 162, 235, 1)',
      green: 'rgba(23, 165, 47, 1)'
    };

    const ctx = document.getElementById('myChart');
    this.myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        labels: ['Cognitivo', 'Emocional', 'Conductual', 'Fortaleza  Mental'],
        datasets: [
          {
            data: this.dataStats,
            backgroundColor: [
                chartColors.default,
                chartColors.default,
                chartColors.default,
                chartColors.default,
            ],
            borderColor: [
               chartColorsBorder.default,
               chartColorsBorder.default,
               chartColorsBorder.default,
               chartColorsBorder.default,
            ],
            borderWidth: 1
          }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
          duration: 4000,
          easing: 'easeInOutQuint'
        },
        legend: {
          display: false
      },
      tooltips: {
          callbacks: {
             label(tooltipItem) {
                    return tooltipItem.yLabel;
             }
          }
      }
    }
});

    const colorChangeValueRed = 12;
    const colorChangeValueBlue = 13;
    const colorChangeValueGreen = 20;
    const dataset = this.myChart.data.datasets[0];
    for (let i = 0; i < dataset.data.length; i++) {
        if (dataset.data[i] < colorChangeValueRed || dataset.data[i]  === colorChangeValueRed ) {
          dataset.backgroundColor[i] = chartColors.red;
          dataset.borderColor[i] = chartColorsBorder.red;
        }else if (dataset.data[i] >= colorChangeValueBlue && dataset.data[i]  <= 19){
          dataset.backgroundColor[i] = chartColors.blue;
          dataset.borderColor[i] = chartColorsBorder.blue;
        }else if (dataset.data[i] >= colorChangeValueGreen){
          dataset.backgroundColor[i] = chartColors.green;
          dataset.borderColor[i] = chartColorsBorder.green;
        }
    }
    this.myChart.update();

  }

  /*radondomData(){
    const chartColors = {
      default: 'rgba(163, 163, 163, 0.2)',
      red: 'rgba(255, 99, 132, 0.2)',
      blue: 'rgba(54, 162, 235, 0.2)',
      green: 'rgba(23, 165, 47, 0.2)'
    };

    const chartColorsBorder = {
      default: 'rgba(163, 163, 163, 1)',
      red:  'rgba(255, 99, 132, 1)',
      blue: 'rgba(54, 162, 235, 1)',
      green: 'rgba(23, 165, 47, 1)'
    };

    const dataset = this.myChart.data.datasets[0];
    for (let i = 0; i < dataset.data.length; i++) {
        dataset.data[i] = Math.floor(Math.random() * 50);
      }

    const colorChangeValueRed = 12;
    const colorChangeValueBlue = 13;
    const colorChangeValueGreen = 20;
    for (let i = 0; i < dataset.data.length; i++) {
      if (dataset.data[i] < colorChangeValueRed || dataset.data[i]  === colorChangeValueRed ) {
        dataset.backgroundColor[i] = chartColors.red;
        dataset.borderColor[i] = chartColorsBorder.red;
      }else if (dataset.data[i] >= colorChangeValueBlue && dataset.data[i]  <= 19){
        dataset.backgroundColor[i] = chartColors.blue;
        dataset.borderColor[i] = chartColorsBorder.blue;
      }else if (dataset.data[i] >= colorChangeValueGreen){
        dataset.backgroundColor[i] = chartColors.green;
        dataset.borderColor[i] = chartColorsBorder.green;
      }
  }


    this.myChart.update();
  }*/

}

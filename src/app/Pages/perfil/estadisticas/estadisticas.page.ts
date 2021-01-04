import { Component, OnInit, ViewChild } from '@angular/core';
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

  bars: any;
  colorArray: any;
  usertk;
  constructor(
    private auth: AuthService,
    private log: LoginService,
  ) { }

  ngOnInit() {
    /**this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
        this.dataStats = [infoUser.cognitivo, infoUser.emocional, infoUser.conductual, infoUser.fortaleza_mental];
    
      });
    });**/
    
  }
  
  @ViewChild('barChart') barChart;
  ionViewDidEnter() {
    this.createBarChart();
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Emocional', 'Cognitivo', 'Conductual', 'Fortaleza mental'],
        datasets: [{
          label: 'Resultados',
          data: [2.0, 1.0, 2.0, 3.0],
          backgroundColor: 'rgba(8, 37, 83, 0.6)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(13, 8, 83)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}

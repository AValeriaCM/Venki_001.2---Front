import { Router } from '@angular/router';
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

  dataStats: any [];

  bars: any;
  colorArray: any;
  usertk = null;
  emocional: number;
  cognitivo: number;
  conductual:number;
  fortaleza:number;

  constructor(
    private auth: AuthService,
    private log: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
         this.dataStats = [infoUser.emocional, infoUser.cognitivo, infoUser.conductual, infoUser.fortaleza_mental];
         this.emocional = this.usertk.emocional;
         this.cognitivo = this.usertk.cognitivo;
         this.conductual = this.usertk.conductual;
         this.fortaleza = this.usertk.fortaleza_mental; 
         this.createBarChart();         
      });   
    });
    
  }
  
  @ViewChild('barChart') barChart;
  ionViewDidEnter() {
    this.createBarChart();
  }

  close() {
    this.router.navigate(['/users/perfil']);
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Emocional', 'Cognitivo', 'Conductual', 'Fortaleza mental'],
        datasets: [{
          label: 'Resultados',
          data:  this.dataStats,//[2.0, 1.0, 2.0, 3.0],//data db
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)"
          ],// array should have same number of elements as number of dataset
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

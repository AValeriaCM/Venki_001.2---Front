import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { PerfilesService } from 'src/app/_services/perfiles.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  @ViewChild('barChart') barChart;
  
  dataStats: any [];

  bars: any;
  colorArray: any;
  usertk = null;
  emocional: number;
  cognitivo: number;
  conductual:number;
  fortaleza:number;

  califications: any [] = new Array();
  labels: any [] = new Array();
  dataSets:  any [] = new Array();

  token: any;
  color = null;
  border = null;

  constructor(
    private auth: AuthService,
    private log: LoginService,
    private router: Router,
    private loadingService: LoadingService,
    private perfilService: PerfilesService
  ) { }

  ngOnInit() {
    this.getToken();
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.log.logdataInfData(resp).subscribe( infoUser => {
        this.usertk = infoUser;
        this.getCalifications();
      });
    });
  }

  getCalifications() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.perfilService.getCalifications(this.usertk.id, this.token).subscribe( (resp: any) => {
      this.califications = resp.data;
      this.loadingService.loadingDismiss();
      if(this.califications.length > 0) {
        this.loadDataSets();
      }
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  
  ionViewDidEnter() {
    this.createBarChart();
  }

  close() {
    this.router.navigate(['/users/perfil']);
  }

  loadDataSets() {
    this.califications.map( dataset => {
      this.dynamicColorsArray();
      this.dataSets.push({
        label: (new Date(dataset.created_at)).toISOString().slice(0, 10),
        data: [
          dataset.reply.Atletico,
          dataset.reply.Nutricion,
          dataset.reply.Bienestar,
          dataset.reply.Fortaleza_Mental,
          dataset.reply.Conductual,
          dataset.reply.Emocional,
          dataset.reply.Cognitivo
        ],
        backgroundColor: this.color,
        borderColor: this.border,
        pointBackgroundColor: this.border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.border
      });
    });
    this.createBarChart(); 
  }

  dynamicColorsArray() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    this.color = "rgba(" + r + "," + g + "," + b + ", 0.2)";
    this.border = "rgb(" + r + "," + g + "," + b + ")";
  };

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Atlético', 'Nutrición', 'Bienestar', 'Fortaleza mental', 'Conductual' , 'Emocional', 'Cognitivo'],
        datasets: this.dataSets
      },
      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
              fontColor: 'rgb(0, 0, 0)'
          }
        },
        scale: {
          reverse: false,
          ticks: {
            beginAtZero: true,
          }
        },
        scaleOverride: true,
        scaleSteps: 5,
        scaleStepWidth: 5,
        scaleStartValue: 0,
        responsive : true , 
        keepAspectRatio : false , 
        animation : { 
            duration : 0 
        } , 
        hover : { 
            animationDuration : 0 
        }, 
        responsiveAnimationDuration : 0 
      }
    });
  }

  back() {
    this.router.navigate(['/users/perfil']);
  }

}

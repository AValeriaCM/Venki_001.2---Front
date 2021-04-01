import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { PassObjectService } from 'src/app/_services/pass-object.service';
@Component({
  selector: 'app-diagnostico-etapa',
  templateUrl: './diagnostico-etapa.page.html',
  styleUrls: ['./diagnostico-etapa.page.scss'],
})
export class DiagnosticoEtapaPage implements OnInit {
  etapa: number;
  donuts: any;
  arrayBac:Array<string>;
  textButton:string;
  colorArray: any;
  info:any;

  constructor(    
    private pEtapa: PassObjectService,
    private router: Router,
    private pObjecto: PassObjectService) { }

  ngOnInit() {
    this.textButton="Continuar";

    this.info= this.pEtapa.getNavData();
    this.etapa=this.info.page;
    if(this.etapa==4){
      this.textButton="Ver resultados";
    }
  }

  @ViewChild('doughnutChart') doughnutChart;

  ionViewDidEnter() {
    this.createDoughnutChart();
  }

  continue(){
    if (this.etapa==4){
      this.router.navigate(['/users/perfil/estadisticas']);
    }else{
    if(this.info.status == 1){
       this.router.navigate(['/users/perfil']);
    } else{
      this.pObjecto.setData(this.info);
      this.router.navigate(['/users/perfil/diagnostico-inicio/']);
    }
    }
  }

  createDoughnutChart() {
    this.arrayBac= [
      "rgba(255, 152, 0, 1)",
      "rgba(244, 67, 54, 1)",
      "rgba(76, 175, 80, 1)",
      "rgba(33, 150, 243, 1)",
      "rgba(244, 67, 54, 1)"
    ];
    this.donuts = new Chart(this.doughnutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Etapa 1', 'Etapa 2', 'Etapa 3','Etapa 4'],
        datasets: [{
          label: "# of Votes",
          data: [0.25,0.25,0.25,0.25],
          backgroundColor:  this.arrayBac,
          borderColor:[
            "rgba(255, 152, 0, 1)",
            "rgba(244, 67, 54, 1)",
            "rgba(76, 175, 80, 1)",
            "rgba(33, 150, 243, 1)",
          ],
          borderWidth: 1,
          hoverBackgroundColor: ["#8BB9F6", "#848B94B"]
        }]
      },
      options: {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        legend: {
          position: 'bottom'
        }
      }
    });
  }
}



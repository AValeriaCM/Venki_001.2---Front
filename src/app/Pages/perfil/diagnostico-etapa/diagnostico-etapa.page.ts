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
    console.log(this.info);
    if(this.etapa==3){
      this.textButton="Ver resultados";
    }
  }

  @ViewChild('doughnutChart') doughnutChart;

  ionViewDidEnter() {
    this.createDoughnutChart();
  }


  continue(){
    console.log(this.etapa);
    console.log(this.info.status);
      if(this.etapa==3){
         this.router.navigate(['/users/perfil/estadisticas']);
      }else{
      if(this.info.status == 1){
           this.router.navigate(['/users/perfil']);
      } else{
        this.pObjecto.setData(this.info);
        this.router.navigate(['/users/perfil/diagnostico/']);
      }
      }
  }
  createDoughnutChart() {
    this.arrayBac= [
      "rgba(0, 42, 104, 0.95)",
      "rgba(20, 20, 240, 0.2)",
      "rgba(10, 155, 240, 0.2)"
    ];
    if(this.etapa==2){
      this.arrayBac= [
        "rgba(0, 42, 104, 0.95)",
        "rgba(20, 20, 240, 0.95)",
        "rgba(10, 155, 240, 0.2)"
      ];
    }
    if(this.etapa==3){
      this.arrayBac= [
        "rgba(0, 42, 104, 0.95)",
        "rgba(20, 20, 240, 0.95)",
        "rgba(10, 155, 240, 0.95)"
      ];
    }
    this.donuts = new Chart(this.doughnutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Etapa 1', 'Etapa 2', 'Etapa 3'],
        datasets: [{
          label: "# of Votes",
          data: [0.35,0.35,0.3],
          backgroundColor:  this.arrayBac, // array should have same number of elements as number of dataset
          borderColor:[
            "rgba(0,12,30, 1)",
            "rgba(185, 197, 202, 1)",
            "rgba(185, 197, 202, 1)"
          ],// array should have same number of elements as number of dataset
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



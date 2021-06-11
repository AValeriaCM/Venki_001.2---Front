import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { PassObjectService } from 'src/app/_services/pass-object.service';
@Component({
  selector: 'app-diagnostico-etapa',
  templateUrl: './diagnostico-etapa.page.html',
  styleUrls: ['./diagnostico-etapa.page.scss'],
})
export class DiagnosticoEtapaPage implements OnInit {

  @ViewChild('legendChart', {static: false}) legendChart: ElementRef;
  @ViewChild('doughnutChart') doughnutChart;

  etapa: number;
  donuts: any;
  textButton:string;
  colorArray: any;
  info:any;
  arrayBac:Array<any> = new Array();

  constructor(    
    private pEtapa: PassObjectService,
    private router: Router,
    private pObjecto: PassObjectService,
    private changeDetectorRef: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.textButton="Continuar";

    this.info= this.pEtapa.getNavData();
    this.etapa=this.info.page;
    if ( this.etapa == 4 ) {
      this.textButton="Ver resultados";
      this.createDoughnutChart();
    }
  }

  createDoughnutChart() {

    this.arrayBac[4] = [
      "rgba(33, 150, 243, 1)",
      "rgba(255, 152, 0, 1)",
      "rgba(76, 175, 80, 1)",
      "rgba(244, 67, 54, 1)"
    ];

    this.changeDetectorRef.detectChanges(); 

    this.donuts = new Chart(this.doughnutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Bloque A', 'Bloque B', 'Bloque C','Bloque D'],
        datasets: [
          {
            data: [5, 1.7, 1.7, 1.6],
            backgroundColor:  this.arrayBac[4],
            borderColor:[
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
            ],
            borderWidth: 2
          }
        ],
      },
      options: {
        legend: {
          display: false
        },
        rotation: (1* Math.PI) - (1 * Math.PI),
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function(index: any, data: any) { 
              return data.labels[index.index];
            }
          }
        },
        legendCallback(chart: any) {
          const text = [];
          const data = chart.data;
          const datasets = data.datasets;
          const labels = data.labels;

          if (datasets.length) {
            text.push('<ion-row>');
            for (let i = 0; i < datasets[0].data.length; ++i) {
              if (labels[i]) {

                text.push('<ion-col size="12">');
                var nameClass = ''
                var label = '';
                if(labels[i] == 'Bloque A') {
                  nameClass = 'bloque-1'
                  label = labels[i]  + ""
                }
                if(labels[i] == 'Bloque B') {
                  nameClass = 'bloque-2'
                  label = labels[i]  + ""
                }
                if(labels[i] == 'Bloque C') {
                  nameClass = 'bloque-3'
                  label = labels[i]  + ""
                }
                if(labels[i] == 'Bloque D') {
                  nameClass = 'bloque-4'
                  label = labels[i]  + ""
                }
                text.push('<p class="text-danger m-b-0 ' + nameClass + '">' + label + '</p>');
              }
              text.push('</ion-col>');
            }
            text.push('</ion-row>');
          }
          return text.join('');
        },
      }
    });
    this.legendChart.nativeElement.innerHTML = this.donuts.chart.generateLegend();
  }

  continue() {
    if ( this.etapa == 4 ) {
      this.router.navigate(['/users/perfil/estadisticas']);
    } else {
      if(this.info.status == 1) {
        this.router.navigate(['/users/perfil']);
      } else{
        this.pObjecto.setData(this.info);
        this.router.navigate(['/users/perfil/diagnostico-inicio/']);
      }
    }
  }
}



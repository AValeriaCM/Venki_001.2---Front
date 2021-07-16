import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PerfilesService } from 'src/app/_services/perfiles.service';
import { Router } from '@angular/router';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { IonSlides, AlertController, NavController, Platform } from '@ionic/angular';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { DiagnosticHelpComponent } from '../diagnostic-help/diagnostic-help.component';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/_services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/_services/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.page.html',
  styleUrls: ['./diagnostico.page.scss'],
})
export class DiagnosticoPage implements OnInit {

  @ViewChild('slider', { static: true }) slidefromHtml: IonSlides;
  @ViewChild('doughnutChart') doughnutChart;
  @ViewChild('legendChart', {static: false}) legendChart: ElementRef;

  status:number;
  cantidad: any;
  profileid: any;
  cuestionario: Array<any>;
  envioDataCuiestionario: Array<any>;
  finalDta: Array<any>;
  userID: any;
  surveyID: any;
  alert: any;
  diagnosticoTemp: Array<any>;
  preguntot: any;
  preguntat: any;
  currentPage: any;
  lastPage: any;
  nextPage: any;
  totallenght: any;
  existe: any;
  cacheArray: Array<any>;
  etapa = false;
  arrayFEnv;
  color:any;
  pagina:number;
  colors= ["rgba(0, 42, 104,1)",
  "rgba(20, 20, 240, 1)",
  "rgba(10, 155, 240, 1)",
  "rgba(216, 99, 99, 1)"];
  token: any;

  arrayBac:Array<any> = new Array();
  donuts: any;
  confirmedExit: boolean = false;
  title = true;
  categorias: any[] = [];

  constructor(
    private perfile: PerfilesService,
    private pObjecto: PassObjectService,
    private pEtapa: PassObjectService,
    public alertController: AlertController,
    private share: ShareserviceService,
    private router: Router,
    private dialogo: ModalController,
    private loadingService: LoadingService,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    public  nav: NavController,
    private platform: Platform
    ) {
    this.getToken();
  }

  ngOnInit() {

  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.loadPage();
    });
  }

  createDoughnutChart() {

    this.arrayBac[1] = [
      "rgba(158, 158, 158, 1)",
      "rgba(158, 158, 158, 1)",
      "rgba(158, 158, 158, 1)",
      "rgba(158, 158, 158, 1)"
    ];

    this.arrayBac[2] = [
      "rgba(33, 150, 243, 1)",
      "rgba(158, 158, 158, 1)",
      "rgba(158, 158, 158, 1)",
      "rgba(158, 158, 158, 1)"
    ];

    this.arrayBac[3] = [
      "rgba(33, 150, 243, 1)",
      "rgba(255, 152, 0, 1)",
      "rgba(158, 158, 158, 1)",
      "rgba(158, 158, 158, 1)"
    ];

    this.arrayBac[4] = [
      "rgba(33, 150, 243, 1)",
      "rgba(255, 152, 0, 1)",
      "rgba(76, 175, 80, 1)",
      "rgba(158, 158, 158, 1)"
    ];

    this.donuts = new Chart(this.doughnutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Bloque A', 'Bloque B', 'Bloque C','Bloque D'],
        datasets: [
          {
            data: [5, 1.7, 1.7, 1.6],
            backgroundColor:  this.arrayBac[this.pagina],
            borderColor:[
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
            ],
            borderWidth: 2,
            hoverBackgroundColor: ["#2196f3", "#ff9800", '#4caf50', '#f44336'],
          }
        ],
      },
      options: {
        legend: {
          display: false
        },
        rotation: (1* Math.PI) - (1 * Math.PI),
        tooltips: {
          enabled: false,
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
                  label = "PRUEBA DE MENTALIDAD"
                }
                if(labels[i] == 'Bloque B') {
                  nameClass = 'bloque-2'
                  label = "PRUEBA NUTRICIONAL"
                }
                if(labels[i] == 'Bloque C') {
                  nameClass = 'bloque-3'
                  label = "PRUEBA DE BIENESTAR"
                }
                if(labels[i] == 'Bloque D') {
                  nameClass = 'bloque-4'
                  label = "PRUEBA ATLÉTICA"
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

  loadPage() {

    this.status = 0;
    this.pagina = 0;
    this.cacheArray = [];
    this.arrayFEnv = [];
    this.cuestionario = [];
    this.finalDta = [];
    this.diagnosticoTemp = [];
    this.envioDataCuiestionario = [];
    const informacion = this.pObjecto.getNavData();
    if(informacion) {
      this.profileid = informacion.idprofile;
      this.userID = informacion.idUser;
    }
    this.pagina = 0;
    this.color="ffff";
    if( this.pagina ==0 ) { 
      this.color = this.colors[0];
    }

    // this.slidefromHtml.lockSwipeToPrev(true);

    if(this.profileid) {
      this.getCategorys();
    } else {
      this.mostrarmensaje('No existen preguntas para el diagnostico', 'Error', 'red-snackbar');
    }
  }

  getCategorys() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCategorias(this.token).subscribe(resp => {
      this.categorias = resp.data.reverse();
      this.validatePage();
      this.loadingService.loadingDismiss();
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  validatePage() {
    this.share.retornarDiagnosticoCurrentpage().then( rest => {
      let tempP = rest;
      this.pagina = tempP;
      this.color= this.colors[this.pagina-1];
      if (tempP === null) {
        this.currentPage = 1;
        this.existe = false;
      } else {
        this.currentPage = tempP;
        this.existe = true;
        this.validadExistencia(this.existe);
      }
      this.pagina = this.currentPage;
      this.createDoughnutChart();
      this.validateCategoryByPage();
    });
  }

  validateCategoryByPage() {
    this.categorias = this.categorias.filter(category => category.category_id === null);
    this.loadCurrentPage(this.categorias[this.pagina - 1].id);
  }

  loadCurrentPage(category: any) {
    
    this.perfile.getPreguntasPerfil(this.profileid, this.token, category).subscribe((profileQ: any) => {

      this.loadingService.loadingDismiss();

      this.preguntot = profileQ.data.length;
      this.preguntat = profileQ.data.length;

      this.share.retornarDiagnosticoLastpage().then( resp  => {
        let tempL = resp;
        if (tempL === null) {
          this.lastPage = 1;
          this.existe = false;
        } else {
          this.lastPage = tempL;
          this.existe  = true;
        }
      });

      this.cantidad = profileQ.data.map( (value: any) => {
        value.calificacionVal = 0;
        return value;
      });

      this.share.retornarDiagnostico().then( diag => {
        let result01: any;
        if (diag !== null) {
          this.cacheArray = diag;
        }
        if( this.currentPage === 5 ) {
          this.cacheArray.forEach(element => {
            result01 = [...new Set([].concat(...this.cacheArray.map((o) => o.myPropArray)))]
          });
          this.arrayFEnv = result01;
        }
      });

      this.share.varTotalPreguntas.subscribe( dt => {
        this.share.retornarDiagnostico().then( diag => {
          let result: any;
          if (diag !== null) {
            this.cacheArray = diag;
          }
          if (this.currentPage === 5) {
            this.cacheArray.forEach(element => {
              result = [...new Set([].concat(...this.cacheArray.map((o) => o.myPropArray)))];
            });
            this.share.retornarDiagnostico().then( diag => {
              let result01;
              if (diag !== null) {
                this.cacheArray = diag;
              }
              if(this.currentPage === 5) {
                this.cacheArray.forEach(element => {
                  result01 = [...new Set([].concat(...this.cacheArray.map((o) => o.myPropArray)))];
                });
                this.arrayFEnv = result01;
              }
              this.enviarQuestion();
            });
          } else {
            this.loadingService.loadingDismiss();
          }
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  validadExistencia(existe: any) {
    if (existe === true) {
      this.cantidad = [];
      this.categorias = this.categorias.filter(category => category.category_id === null);
      var category = this.categorias[this.currentPage - 1].id
      this.perfile.getPreguntasPerfil(this.profileid, this.token, category).subscribe((netpreg: any) => {
        this.preguntat = netpreg.data.length;
        this.preguntot = netpreg.data.length;
        this.cantidad = netpreg.data.map(value => {
          value.calificacionVal = 0;
          return value;
        });
      });
    }
  }
  
  calificacion(event: any, id: any, index: any) {
    const res = [];
    const listemp = [];
    if (this.cuestionario.length === 0) {
      this.cuestionario.push(index);
      this.slidefromHtml.lockSwipeToNext(false);
      this.finalDta = res;
    } else {
      this.cuestionario.push(index);
      this.cuestionario.map((item) => {
        const existItem = res.find(x => x.id === item.id);
        if (existItem) {
          this.slidefromHtml.lockSwipeToNext(false);
          this.finalDta = res;
        } else {
          this.slidefromHtml.lockSwipeToNext(false);
          if (item.calificacionVal !== 0) {
            this.surveyID = item.survey_id;
            if(item.answers.length > 0) {
              const find = item.answers.find( (answer: any) => +answer.id === +item.calificacionVal);
              if(find) {
                item.valMultiple = find.point;
              }
            }
            if(item.subcategory_id === null) {
              if(item.valMultiple) {
                res.push({ id: item.id, r: item.valMultiple, ct: item.category_id });
              } else {
                res.push({ id: item.id, r: item.calificacionVal, ct: item.category_id });
              }
              this.finalDta = res;
            } else {
              if(item.valMultiple) {
                res.push({ id: item.id, r: item.valMultiple, ct: item.subcategory_id });
              } else {
                res.push({ id: item.id, r: item.calificacionVal, ct: item.subcategory_id });
              }
              this.finalDta = res;
            }
          }
        }
      });
    }
  }

  terminarEtapa() {
    this.etapa = true;
    if (this.currentPage === 2) {
      this.alertDespuesTiempoimg1();
    } else if (this.currentPage === 3) {
      this.alertDespuesTiempoimg2(2);
    } else if (this.currentPage  === 4) {
      this.alertDespuesTiempoimg2(3);
    }
  }

  async presentarDialogo() {
    const modal = await this.dialogo.create({
      component: DiagnosticHelpComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }


  guardar() {
    this.status=1;
    this.currentPage = this.currentPage + 1;
    this.cacheArray.push({myPropArray: this.finalDta});
    this.share.guardarDiagnostico(this.cacheArray);
    this.share.guardarDiagnosticoCurrenpage(this.currentPage);
    this.share.guardarDiagnosticoLastpage(this.lastPage);
    this.finalDta = [];
    this.cuestionario = [];
    this.cantidad = [];
    this.etapa = false;
    this.terminarEtapa();
  }

  Continuar() {
    this.status = 2;
    this.currentPage = this.currentPage + 1;
    this.cantidad = [];
    if(this.currentPage <= 4) {
      this.loadingService.loadingPresent({spinner: "circles" });
      var category = this.categorias[this.currentPage - 1].id
      this.perfile.getPreguntasPerfil(this.profileid, this.token, category).subscribe((netpreg: any) => {
        this.preguntat = netpreg.data.length;
        this.preguntot = netpreg.data.length;
        this.cantidad = netpreg.data.map(value => {
          value.calificacionVal = 0;
          return value;
        });
        this.cacheArray.push({myPropArray: this.finalDta});
        this.share.guardarDiagnostico(this.cacheArray);
        this.share.guardarDiagnosticoCurrenpage(this.currentPage);
        this.share.guardarDiagnosticoLastpage(this.lastPage);
        this.finalDta = [];
        this.cuestionario = [];
        this.loadingService.loadingDismiss();
        this.terminarEtapa();
        this.etapa = false;
      });
    } else {
      this.loadingService.loadingPresent({spinner: "circles" });
      this.cacheArray.push({myPropArray: this.finalDta});
      this.share.guardarDiagnostico(this.cacheArray);
      this.share.guardarDiagnosticoCurrenpage(this.currentPage);
      this.share.guardarDiagnosticoLastpage(this.lastPage);
      this.finalDta = [];
      this.cuestionario = [];
      this.share.varTotalPreguntas.next('update preguntas');
      this.etapa = false;
    }
  }

  enviarQuestion() {
    const infoConvert = JSON.stringify(this.arrayFEnv);
    this.perfile.SendSurveyInfo(infoConvert, this.surveyID, this.userID, this.token).subscribe(surveyResponse => {
      let surveyed = 1;
      this.share.editSurveyed(surveyed, this.userID, this.token).subscribe( res => {
        this.loadingService.loadingDismiss();
        this.share.removerDiagnostico();
        this.share.removerDiagnosticoCurrenpage();
        this.share.removerDiagnosticoLastpage();
        this.share.var.next('Update Diagnostico');
        let dataObj = {
          idprofile: this.profileid,
          idUser:  this.userID,
          page: 4,
          status:this.status
        };
        this.pEtapa.setData(dataObj);
        this.router.navigate(['/users/perfil/diagnostico-etapa']);
      }, error => {
        this.loadingService.loadingDismiss();
      });
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  verifImg()  {
    this.title = false;
    this.slidefromHtml.getActiveIndex().then( index => {
      if(index > 1) {
        this.preguntat = this.preguntat - 1;
      }
    });
    this.slidefromHtml.lockSwipeToNext(true);
    if (this.cuestionario.length === 0) {
      this.alertnodata();
    } else {
      this.slidefromHtml.getActiveIndex().then(id => {
        this.slidefromHtml.lockSwipeToNext(true);
      });
    }
  }

   alertDespuesTiempoimg1() {
    const informacion = this.pObjecto.getNavData();
    let dataObj = {
      idprofile: this.profileid,
      idUser:  this.userID,
      page: 1,
      status:this.status
    };
    this.pEtapa.setData(dataObj);
    this.router.navigate(['/users/perfil/diagnostico-etapa/']);

  }

   alertDespuesTiempoimg2(position:number) {
    const informacion = this.pObjecto.getNavData();
    let dataObj = {
      idprofile: this.profileid,
      idUser:  this.userID,
      page:position,
      status:this.status
    };
    this.pEtapa.setData(dataObj);
    this.router.navigate(['/users/perfil/diagnostico-etapa/']);
  }

   alertDespuesTiempoimg3() {
    const informacion = this.pObjecto.getNavData();
    let dataObj = {
      idprofile: this.profileid,
      idUser:  this.userID,
      page:4,
      status:this.status
    };
    this.pEtapa.setData(dataObj);
    this.router.navigate(['/users/perfil/diagnostico-etapa/']);
  }

  async alertnodata() {
    this.alert = await this.alertController.create({
      cssClass: 'my-custom-class2',
      header: 'Recuerda',
      message: 'Debes seleccionar un valor en tus preguntas o no podras enviar nigun dato',
      buttons: ['OK'],
    });
    await this.alert.present();
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }

}

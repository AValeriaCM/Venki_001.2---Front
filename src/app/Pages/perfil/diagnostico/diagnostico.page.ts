import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfilesService } from 'src/app/_services/perfiles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { IonSlides, AlertController } from '@ionic/angular';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.page.html',
  styleUrls: ['./diagnostico.page.scss'],
})
export class DiagnosticoPage implements OnInit {

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

  @ViewChild('slider', { static: true }) slidefromHtml: IonSlides;

  constructor(
    private perfile: PerfilesService,
    private route: ActivatedRoute,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    private share: ShareserviceService,
    private router: Router) {
  }

  ngOnInit() {
    this.cacheArray = [];
    this.arrayFEnv = [];
    this.cuestionario = [];
    this.finalDta = [];
    this.diagnosticoTemp = [];
    this.envioDataCuiestionario = [];
    const informacion = this.pObjecto.getNavData();
    this.profileid = informacion.idprofile;
    this.userID = informacion.idUser;

    this.alertAvisoGif();

    this.slidefromHtml.lockSwipeToPrev(true);

    this.perfile.getPreguntasPerfil(this.profileid).subscribe((profileQ: any) => {
      console.log('tamaño', profileQ);
      this.preguntot = profileQ.data.length;
      this.preguntat = profileQ.data.length;
      this.totallenght  = profileQ.meta.total;

      this.share.retornarDiagnosticoCurrentpage().then( rest => {
        let tempP = rest;
        console.log('Pagina', tempP);
        if (tempP === null){
          this.currentPage = profileQ.meta.current_page;
          this.existe = false;
        }else {
          this.currentPage = tempP;
          this.existe = true;
          this.validadExistencia(this.existe);
        }
      });

      this.share.retornarDiagnosticoLastpage().then( restt  => {
        let tempL = restt;
        console.log('Pagina', tempL);
        if (tempL === null){
          this.lastPage = profileQ.meta.last_page;
          this.existe = false;
        }else {
          this.lastPage = tempL;
          this.existe  = true;
        }
      });

      this.cantidad = profileQ.data.map(value => {
        value.calificacionVal = 0;
        return value;
      });

      this.share.retornarDiagnostico().then( diag => {
        let result01;
        console.log('El diagnistico guardado01', diag);
        if (diag !== null){
          this.cacheArray = diag;
        }
        if(this.currentPage === 4){
          this.cacheArray.forEach(element => {
            result01 = [...new Set([].concat(...this.cacheArray.map((o) => o.myPropArray)))]
          });
          this.arrayFEnv = result01;
          console.log('union final 01', this.arrayFEnv.length, this.totallenght);
        }
      });

      this.share.varTotalPreguntas.subscribe( dt => {
        this.share.retornarDiagnostico().then( diag => {
          let result;
          if (diag !== null){
            this.cacheArray = diag;
          }
          if (this.currentPage === 4){
            this.cacheArray.forEach(element => {
              result = [...new Set([].concat(...this.cacheArray.map((o) => o.myPropArray)))];
            });
            if (result.length !== this.totallenght){
              this.share.retornarDiagnostico().then( diag => {
                let result01;
                if (diag !== null){
                  this.cacheArray = diag;
                }
                if(this.currentPage === 4){
                  this.cacheArray.forEach(element => {
                    result01 = [...new Set([].concat(...this.cacheArray.map((o) => o.myPropArray)))];
                  });
                  this.arrayFEnv = result01;
                  console.log('union final 03', this.arrayFEnv, this.totallenght);
                }
              });
            } else {
              this.arrayFEnv = result;
            }
          }
        });
      });

    });


  }


  validadExistencia(existe: any){
    console.log('valida existencias',  existe);
    if (existe === true){
      const nuevoArra = this.totallenght;
      this.cantidad = [];
      if (this.preguntot !== nuevoArra) {
        this.share.getNetDiagnostico(this.profileid, this.currentPage).subscribe((netpreg: any) => {
          this.preguntat = netpreg.data.length;
          this.preguntot = netpreg.data.length;
          this.cantidad = netpreg.data.map(value => {
            value.calificacionVal = 0;
            return value;
          });
          console.log('cantidad Final si existe', this.cantidad);
        });
      }
    }
  }

  calificacion(event, id: any, index: any) {

    const res = [];
    const listemp = [];
    // console.log(event.detail.value, id, index);

    if (this.cuestionario.length === 0) {
      this.cuestionario.push(index);
      this.slidefromHtml.lockSwipeToNext(false);
    } else {
      this.cuestionario.push(index);
      this.cuestionario.map((item) => {
        const existItem = res.find(x => x.id === item.id);
        if (existItem) {
          this.slidefromHtml.lockSwipeToNext(false);
        } else {
          this.slidefromHtml.lockSwipeToNext(false);
          if (item.calificacionVal !== 0) {
            this.surveyID = item.survey_id;
            res.push({ id: item.id, r: item.calificacionVal, ct: item.category_id });
          }
        }
      });
      this.finalDta = res;
    }
  }

  terminarEtapa(){
    this.etapa = true;
    if (this.currentPage === 1){
      this.alertDespuesTiempoimg1();
    } else if (this.currentPage === 2){
      this.alertDespuesTiempoimg2();
    } else if (this.currentPage  === 3){
      this.alertDespuesTiempoimg3();
    }
  }

  guardar(){
    this.currentPage = this.currentPage + 1;
    this.cacheArray.push({myPropArray: this.finalDta});
    this.share.guardarDiagnostico(this.cacheArray);
    this.share.guardarDiagnosticoCurrenpage(this.currentPage);
    this.share.guardarDiagnosticoLastpage(this.lastPage);
    this.finalDta = [];
    this.cuestionario = [];
    this.cantidad = [];
    this.etapa = false;
    this.router.navigate(['/users/perfil']);
  }

  Continuar(){
    setTimeout(() => {
      this.currentPage = this.currentPage + 1;
      const nuevoArra = this.totallenght;
      this.cantidad = [];
      if (this.preguntot !== nuevoArra) {
        this.share.getNetDiagnostico(this.profileid, this.currentPage).subscribe((netpreg: any) => {
          this.preguntat = netpreg.data.length;
          this.preguntot = netpreg.data.length;
          this.cantidad = netpreg.data.map(value => {
            value.calificacionVal = 0;
            return value;
          });
          this.cacheArray.push({myPropArray: this.finalDta});
          console.log('Resultado a guardar', this.cacheArray);
          this.share.guardarDiagnostico(this.cacheArray);
          this.share.guardarDiagnosticoCurrenpage(this.currentPage);
          this.share.guardarDiagnosticoLastpage(this.lastPage);
          this.finalDta = [];
          this.cuestionario = [];
          if (this.currentPage === 4){
            this.share.varTotalPreguntas.next('update preguntas');
          }
          this.etapa = false;
        });
      }
    }, 1000);
  }

  enviarQuestion() {
    const infoConvert = JSON.stringify(this.arrayFEnv);
    this.perfile.SendSurveyInfo(infoConvert, this.surveyID, this.userID).subscribe(surveyResponse => {
      console.log(surveyResponse);
      let surveyed = 1;
      this.share.editSurveyed(surveyed, this.userID).subscribe( res => {
        console.log(res);
        this.share.removerDiagnostico();
        this.share.removerDiagnosticoCurrenpage();
        this.share.removerDiagnosticoLastpage();
        this.share.var.next('Update Diagnostico');
        this.router.navigate(['/users/perfil']);
      });
    });
  }

  verifImg() {
    this.preguntat = this.preguntat - 1;
    this.slidefromHtml.lockSwipeToNext(true);
    if (this.finalDta.length === 0) {
      this.alertnodata();
    } else {
      this.slidefromHtml.getActiveIndex().then(id => {
        this.slidefromHtml.lockSwipeToNext(true);
      });
    }
  }

  async alertAvisoGif() {
    this.alert = await this.alertController.create({
      cssClass: 'my-custombackInicio',
      header: 'Recuerda Dezlizar a la Derecha',
      buttons: [
        {
          text: '',
          cssClass: 'secondaryClose',
        }
      ],
    });
    await this.alert.present();
  }


  async alertDespuesTiempoimg1() {
    this.alert = await this.alertController.create({
      cssClass: 'my-customback1',
      header: '',
      buttons: [
        {
          text: '',
          cssClass: 'secondaryClose',
        }
      ],
    });
    await this.alert.present();
  }

  async alertDespuesTiempoimg2() {
    this.alert = await this.alertController.create({
      cssClass: 'my-customback2',
      header: '',
      buttons: [
        {
          text: '',
          cssClass: 'secondaryClose',
        }
      ],
    });
    await this.alert.present();
  }

  async alertDespuesTiempoimg3() {
    this.alert = await this.alertController.create({
      cssClass: 'my-customback3',
      header: '',
      buttons: [
        {
          text: '',
          cssClass: 'secondaryClose',
        }
      ],
    });
    await this.alert.present();
  }

  async alertnodata() {
    this.alert = await this.alertController.create({
      cssClass: 'my-custom-class2',
      header: 'Recuerda',
      message: 'Debes Seleccionar un valor en tus preguntas o no podras enviar nada',
      buttons: ['Entiendo'],
    });
    await this.alert.present();
  }

}

import { PassObjectAuxService } from './../../../_services/pass-object-aux.service';
import { PassObjectExamenService } from './../../../_services/pass-object-examen.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.page.html',
  styleUrls: ['./examen.page.scss'],
})
export class ExamenPage implements OnInit {

  examenDT: any = null;
  valorChange: any;
  totalExam: Array<any>;
  dt: any[] = [];
  tama: any;
  alert: any;
  //-new----
  auxProgreso: number;
 color: string;
 data: any;
 userinfo;
 course:string;
courseID: number;
progreso:number;
share: any;
info: string;
comentariosGeneral: any;
CourseLessonID: number;
orderStorage: any;
cursos: any[] = [];

  constructor(
    private pObjecto: PassObjectService,
    private pObjectExamen: PassObjectExamenService,
    private pObjectAux: PassObjectAuxService,
    private  alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
   /* const infor = this.pObjectAux.getNavData();
    console.log('info examen progreso:', infor);
    this.color=infor.color;
    this.data = infor.infoCurso;
    this.userinfo = infor.userInf;
    this.course = infor.course.name;
    this.courseID = infor.infoCurso.id;
    this.share.getCursoEspecifico(this.data.id).subscribe(async infodt => {
      this.info = infodt.data;
      this.share.getComentariosCurso(this.data.id).subscribe(info => {
        this.comentariosGeneral = info.data;
        this.share.getCursosUsuario(this.userinfo.id).subscribe(dataCurso => {
              let temid  = dataCurso.data;


              let dttemp = temid.filter(r => r.id === this.courseID);

              dttemp.forEach(element => {
                this.CourseLessonID = element.id;
                this.progreso = element.pivot.progress;
                console.log('data Temporal VER:', element.pivot.progress);
              });
              console.log('LEccion del curso',this.CourseLessonID);
              this.share.hayorder().then( val => {
                if (val){
                  console.log('entre true', val);
                  this.share.verorder().then( rval => {
                    this.orderStorage = rval;
                    console.log(this.orderStorage, rval);
                  });
                }else{
                  console.log('entre false', val);
                  this.share.iniciorder();
                }
              });

              this.cursos = dttemp;
              console.log('curso examen', this.cursos);
            });
      });
    });*/


    this.totalExam = [];
    const informacion = this.pObjectExamen.getNavData();
    console.log('info examen', informacion);
    this.examenDT  = informacion.examen.exam;
    this.tama = this.examenDT.length;
  }

  obtenerVal(nombre: any,value: any, correct: any){

    this.valorChange = value;

    this.examenDT.filter( f => {
      if (this.totalExam.length === 0){
        this.totalExam.push({pregunta: nombre, val: value, corec: correct});
      }else if (this.totalExam.length > 0){
        if (f.p === nombre){
          let temDt = {pregunta: nombre, val: value, corec: correct};
          let res  = this.totalExam.map(e => {
            return e.pregunta;
          }).indexOf(nombre);
          this.totalExam[res] = temDt;
        }else if  (f.p !== nombre){
          let temDt = {pregunta: nombre, val: value, corec: correct};
          let res  = this.totalExam.map(e => {
            return e.pregunta;
          }).indexOf(nombre);
          if (res === -1){
            this.totalExam.push({pregunta: nombre, val: value, corec: correct});
          }else{
            this.totalExam[res] = temDt;
          }
        }
      }
    });

    if (this.examenDT.length > 0) {
      this.examenDT.filter(r => r.p === nombre).forEach(r => {
        r.op.forEach(element => {
          if (element.id !== value.id){
            element.select = false;
          }
        });
      });
    }
  }

  calificar(){
    let correcto = 0;
    let incorrecto = 0;

    this.totalExam.forEach( res => {
      let resco: number = +res.corec;
      if (res.val.id ===  resco){
        correcto = correcto + 1;
      }else {
        incorrecto = incorrecto + 1;
      }
    });

    console.log(correcto, incorrecto);
    this.alertDespuesTiempo(correcto, incorrecto);
    this.pObjecto.setData(this.pObjectAux.getNavData());
    console.log('nav del examen' + this.pObjectExamen);
    this.router.navigate(['/users/entrena/vercurso']);
  }

  async alertDespuesTiempo(correcto: any, incorrecto: any) {
    this.alert = await this.alertController.create({
      header: 'Felicidades',
      subHeader:
        'Completaste el examen tu puntaje es',
      message:
        'Correcto: ' + correcto + '\n\n' +
        'Incorrecto: ' +   incorrecto,
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  /*guardaProgreso(progreso){
    if( progreso == 0 ){
      const numLeccion = 1/numeroLecciones;
      }
  }*/
}

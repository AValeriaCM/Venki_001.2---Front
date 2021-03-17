
import { PassNameLessonsService } from './../../../_services/pass-name-lessons.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectVideoService } from './../../../_services/pass-object-video.service';
import { PassObjectAuxService } from './../../../_services/pass-object-aux.service';
import { PassObjectExamenService } from './../../../_services/pass-object-examen.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { UsuarioCurso } from 'src/app/_model/UsuarioCurso';

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
info: string;
comentariosGeneral: any;
CourseLessonID: number;
orderStorage: any;
cursos: any[] = [];
numLecciones: number;
indexLection: number;
newProgress: number;
user: UsuarioCurso;

  constructor(
    private pObjecto: PassObjectService,
    private pObjectExamen: PassObjectExamenService,
    private pObjectAux: PassObjectAuxService,
    private pObjectVideo: PassObjectVideoService,
    private pObjectIndex: PassNameLessonsService,
    private  alertController: AlertController,
    private share: ShareserviceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.totalExam = [];
    const informacion = this.pObjectExamen.getNavData();
    this.examenDT  = informacion.examen.exam;
    this.tama = this.examenDT.length;
    this.indexLection = this.pObjectIndex.getData();
    
    const infor = this.pObjectAux.getNavData();
    //console.log('lo que necesito en vidplayer:', informacion);
    this.color=infor.color;
    this.data = infor.infoCurso;
    this.userinfo = infor.userInf;
    this.course = infor.course.name;
    this.courseID = infor.infoCurso.id;
    this.share.guardarCursoActiva(infor);
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
                console.log('data progreso temp', this.progreso);
              });

              this.cursos = dttemp;
              console.log('examen progress', this.cursos);
              this.cursos.forEach(element => {
                this.numLecciones = element.lessons.length;
              });
              console.log('lecciones',this.numLecciones);
              
            });
      });
    });
      //this.calificar();
    
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
    this.alertDespuesTiempo(correcto, incorrecto);
    this.pObjecto.setData(this.pObjectAux.getNavData());
    this.pObjectVideo.setData(this.pObjectAux.getNavData());
    this.pObjectExamen.setData(this.pObjectAux.getNavData());
    this.guardaProgreso(this.progreso);
    this.router.navigateByUrl('/users/entrena/vercurso');
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

  async alertProgreso() {
    this.alert = await this.alertController.create({
      header: 'Felicidades',
      subHeader:
        'Terminaste La Leccion',
      message:
        'Pasa a la siguiente Leccion para incrementar tu Progreso',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }
  
  guardaProgreso(progreso: number){
    this.user = new UsuarioCurso;
    let varProgreso = progreso;
    console.log(varProgreso);
    this.newProgress = 1/this.numLecciones;
    
    if( varProgreso >= 0.60 && varProgreso < 1 && this.numLecciones == 3){
      this.user.progress = 1;
      this.share.actualizarProgreso(this.userinfo.id,this.courseID, this.user.progress).subscribe(()=>{
        this.alertProgreso();
      });
    }else if( varProgreso == 0 && varProgreso < 1){
      console.log(this.newProgress.toFixed(2));
      this.user.progress =  parseFloat(this.newProgress.toFixed(2));
      //servicio que envia el progreso.
      this.share.actualizarProgreso(this.userinfo.id,this.courseID,this.user.progress).subscribe(()=>{

      });
      this.alertProgreso();
    }else if(varProgreso !== 0 && varProgreso < 1){  
       
      let progress: number;  
      console.log(this.newProgress,'progreso operacion');//mirar el acumulador
      this.newProgress = this.newProgress + varProgreso;
      console.log('entra acumula',this.newProgress.toFixed(2));
      progress = parseFloat(this.newProgress.toFixed(2));
      this.user.progress = progress; 
      console.log(this.userinfo.id,this.courseID, this.user.progress);
      this.share.actualizarProgreso(this.userinfo.id,this.courseID, this.user.progress).subscribe(()=>{
        this.alertProgreso();
      });
      
    }
  }
}

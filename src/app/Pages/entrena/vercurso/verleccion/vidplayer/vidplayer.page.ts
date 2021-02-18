import { PassObjectExamenService } from './../../../../../_services/pass-object-examen.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PassObjectVideoService } from 'src/app/_services/pass-object-video.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-vidplayer',
  templateUrl: './vidplayer.page.html',
  styleUrls: ['./vidplayer.page.scss'],
})


export class VidplayerPage implements OnInit {

  data: any;
  vid: Array<any>;
  orderID: any;
  tam: any;
 //new------
 info;
 calificacionVal;
 menajeNuevo = '';
 userinfo;
 alert: any;
 img = 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png';
 comentariosGeneral: any[] = [];
 infomsg: any;
 autoClose = true;
 progesoVal;
 course: any;
 courseID: any;
 CourseLessonID: any;
 cursos: any[] = [];
 orderStorage: any;
 exam = 0;
 color:string;
 progreso: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pObjecto: PassObjectService,
    private pObjectoVideo: PassObjectVideoService,
    private PObjectoExamen: PassObjectExamenService,
    private share: ShareserviceService) {
  }  

  ngOnInit() {
     let info = this.pObjectoVideo.getNavData();
    console.log('info vidplayer',info);
    this.share.guardarLeccionActiva(info);
    this.data = info.vidInfo;
    this.orderID = info.orderid;
    this.tam = info.tm;
    this.vid = [];
    this.vid.push(this.data);
    this.share.verorder().then( rval => {
      if (rval === this.tam){
        this.share.varExam.next('Listo para el examen');
      }else{
        this.share.updateorder(this.orderID);
      }
    });
   
    const informacion = this.PObjectoExamen.getNavData();
    console.log('lo que necesito en vidplayer:', informacion);
    this.color=informacion.color;
    this.data = informacion.infoCurso;
    this.userinfo = informacion.userInf;
    this.course = informacion.course.name;
    this.courseID = informacion.infoCurso.id;
    this.share.guardarCursoActiva(informacion);
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
              console.log('curso vidplay', this.cursos);
            });
      });
    });

    
  }

  examen(exam: any){
    console.log('EXAMEN vidplay', exam);
    const dataObj = {
      examen: exam,
    };
    this.PObjectoExamen.setData(dataObj);
    this.router.navigate(['/users/entrena/examen/']);
  }
  
  volverAnterior(){
    let object =this.pObjecto.getNavData();
    this.pObjectoVideo.setData(object);
    console.log('info pobject', object);
    this.router.navigate(['/users/entrena/vercurso/verleccion/audioplayer/']);
  }
}

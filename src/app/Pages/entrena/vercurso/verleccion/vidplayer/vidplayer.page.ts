import { PassObjectExamenService } from './../../../../../_services/pass-object-examen.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PassObjectVideoService } from 'src/app/_services/pass-object-video.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectAuxService } from 'src/app/_services/pass-object-aux.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { AuthService } from 'src/app/_services/auth.service';

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
 token: any;

  constructor(
    private router: Router,
    private pObjecto: PassObjectService,
    private pObjectoVideo: PassObjectVideoService,
    private PObjectoExamen: PassObjectExamenService,
    private PObjectoAuxiliar: PassObjectAuxService,
    private share: ShareserviceService,
    private loadingService: LoadingService,
    private auth: AuthService
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

  loadPage() {
    let info = this.pObjectoVideo.getNavData();
    this.share.guardarLeccionActiva(info);
    this.data = info.vidInfo;
    this.orderID = info.orderid;
    this.tam = info.tm;
    this.vid = [];
    this.vid.push(this.data);
    this.share.verorder().then( rval => {
      if (rval === this.tam){
      }else{
        this.share.updateorder(this.orderID);
      }
    });
    const informacion = this.PObjectoExamen.getNavData();
    this.color=informacion.color;
    this.data = informacion.infoCurso;
    this.userinfo = informacion.userInf;
    this.course = informacion.course.name;
    this.courseID = informacion.infoCurso.id;
    this.share.guardarCursoActiva(informacion);
    this.getCourse();
  }

  getCourse() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCursoEspecifico(this.data.id, this.token).subscribe(async infodt => {
      this.info = infodt.data;
      this.share.getComentariosCurso(this.data.id, this.token).subscribe(info => {
        this.comentariosGeneral = info.data;
        this.share.getCursosUsuario(this.userinfo.id, this.token).subscribe(dataCurso => {
          this.loadingService.loadingDismiss();
          let temid  = dataCurso.data;
          let dttemp = temid.filter(r => r.id === this.courseID);
          dttemp.forEach(element => {
            this.CourseLessonID = element.id;
            this.progreso = element.pivot.progress;
          });
          this.share.hayorder().then( val => {
            if (val){
              this.share.verorder().then( rval => {
                this.orderStorage = rval;
              });
            }else{
              this.share.iniciorder();
            }
          });
          this.cursos = dttemp;
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }


  examen(exam: any){
    const dataObj = {
      examen: exam,
    };
    this.PObjectoExamen.setData(dataObj);
    this.router.navigate(['/users/entrena/examen/']);
  }

  volverAnterior(){
    this.pObjectoVideo.setData(this.PObjectoAuxiliar.getNavData());
    this.PObjectoExamen.setData(this.PObjectoAuxiliar.getNavData());
    this.pObjecto.setData(this.PObjectoAuxiliar.getNavData());
    this.router.navigate(['/users/entrena/vercurso/verleccion/']);
  }
}

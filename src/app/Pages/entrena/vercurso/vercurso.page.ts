import { environment } from 'src/environments/environment';
import { PassObjectAuxService } from './../../../_services/pass-object-aux.service';
import { PassObjectExamenService } from './../../../_services/pass-object-examen.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { PassObjectVideoService } from 'src/app/_services/pass-object-video.service';
import { PassNameLessonsService } from 'src/app/_services/pass-name-lessons.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-vercurso',
  templateUrl: './vercurso.page.html',
  styleUrls: ['./vercurso.page.scss'],
})
export class VercursoPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;

  data: any;
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
  comments = false;
  constructor(
    private router: Router,
    private share: ShareserviceService,
    public alertController: AlertController,
    private pObjecto: PassObjectService,
    private pObjectoVideo: PassObjectVideoService,
    private pObjectExamen: PassObjectExamenService,
    private pObjetoAux: PassObjectAuxService,
    private PObjecIndex: PassNameLessonsService,
    private previewAnyFile: PreviewAnyFile,
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
    const informacion = this.pObjecto.getNavData();
    this.pObjectoVideo.setData(informacion);
    this.pObjectExamen.setData(informacion);
    this.pObjetoAux.setData(informacion);
    this.color=informacion.color;
    this.data = informacion.infoCurso;
    this.userinfo = informacion.userInf;
    this.course = informacion.course.name;
    this.courseID = informacion.infoCurso.id;

    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCursoEspecifico(this.data.id, this.token).subscribe(async infodt => {
      this.info = infodt.data;
      this.share.getComentariosCurso(this.data.id, this.token).subscribe(info => {
        this.comentariosGeneral = info.data;
        this.share.getCursosUsuario(this.userinfo.id, this.token).subscribe(dataCurso => {
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
          this.loadingService.loadingDismiss();
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });

    this.share.varorder.subscribe( res  =>  {
      this.share.hayorder().then( val => {
        if (val){
          this.share.verorder().then( rval => {
            this.orderStorage = rval;
          });
        }else{
          this.share.iniciorder();
        }
      });
    });

    this.share.varExam.subscribe( res => {
      this.exam = 1;
    });
  }

  calificacion(event) {
    this.calificacionVal = event.detail.value;
  }

  countStar(star) {
    this.selectedValue = star;
    return this.calificacionVal = this.selectedValue;
  }

  enviarMensaje() {
    if (this.calificacionVal) {
      this.share.enviarComentarioIPutuacion(this.data.id, this.userinfo.id, this.menajeNuevo, this.calificacionVal, this.token).subscribe(data => {
        this.share.getComentariosCurso(this.data.id, this.token).subscribe(info => {
          this.menajeNuevo = '';
          this.calificacionVal = 1;
          this.comentariosGeneral = info.data;
          setTimeout(() => {
            this.content.scrollToBottom(200);
          });
        });
      });
    } else {
      this.alertDespuesTiempo();
    }
  }

  async alertDespuesTiempo() {
    this.alert = await this.alertController.create({
      header: 'HEY!',
      subHeader:
        'Por favor califica nuestros cursos, es importante',
      message:
        'Puedes calificar desplazandote y seleccionando las estrellas para la calificacion de 1 a 5.',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  getcursos(userid: any) {
    this.share.getCursos(this.token).subscribe(info => {
      this.cursos = info.data;
    });
  }

  toggleItem(index, leccionesIndex) {
    this.cursos[index].lessons[leccionesIndex].open = !this.cursos[index].lessons[leccionesIndex].open;
    this.PObjecIndex.setData(leccionesIndex);
    this.router.navigate(['/users/entrena/vercurso/leccion-inicio']);
  }

  previewDocuments(lectionName: any, doc: any, order: any, tma: any) {

    const dataObj = {
      name: lectionName,
      documento: doc,
      orderid: order,
      tm: tma
    };

    this.share.guardarLeccionActiva(dataObj);

    this.share.verorder().then( rval => {
      if (rval === tma){
        this.share.varExam.next('Listo para el examen');
      }else{
        this.share.updateorder(order);
      }
    });
    let url = environment.HOST + doc;
    this.previewAnyFile.preview(url).then(() => {

    }, (err) => {
    });
  }

  audioPlayer(lectionName: any, content: any, order: any, tma: any) {
    const dataaud = environment.HOST + content;
    const dataObj = {
      name: lectionName,
      audioInfo: dataaud,
      orderid: order,
      tm: tma
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/entrena//vercaudioplayer/']);
  }

  toggleSection(index, progreso) {
    this.cursos[index].open = !this.cursos[index].open;
    this.progesoVal = progreso * 100;
    if (this.autoClose && this.cursos[index].open) {
      this.cursos
        .filter((item, itemIndex) => itemIndex !== index)
        .map(item => item.open = false);
    }
  }
  
  verUser(userdt: any){
    this.pObjecto.setData({userinfo: userdt});
    this.router.navigate(['/users/social/ver-usuario']);
  }
}

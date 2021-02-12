import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonContent, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-verleccion',
  templateUrl: './verleccion.page.html',
  styleUrls: ['./verleccion.page.scss'],
})
export class VerleccionPage implements OnInit {

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
  objetoVideo: any;

  course: any;
  courseID: any;
  CourseLessonID: any;
  cursos: any[] = [];
  orderStorage: any;
  exam = 0;
  color:string;
  progreso: any;

lectionName: any; video: any;  order: any; tma: any;

  @ViewChild(IonContent) content: IonContent;

  @Input() mensaje: any;
  @Input()  
  infoVideo = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private share: ShareserviceService,
    public alertController: AlertController,
    private pObjecto: PassObjectService,
    private pObjectVideo: PassObjectService,
    private previewAnyFile: PreviewAnyFile,
    private streaminmedia: StreamingMedia ) {
  }

  ngOnInit() {

      const informacion = this.pObjecto.getNavData();
    this.color=informacion.color;
    this.data = informacion.infoCurso;
    this.userinfo = informacion.userInf;
    this.course = informacion.course.name;
    this.courseID = informacion.infoCurso.id;
    this.share.guardarCursoActiva(informacion);
    this.share.getCursoEspecifico(this.data.id).subscribe(async infodt => {
      this.info = infodt.data;
      console.log('Informacion guardada' + infodt.data);
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
              console.log('cursos', this.cursos);
            });
      });
    });

    this.share.varorder.subscribe( res  =>  {
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
    });

    this.share.varExam.subscribe( res => {
      console.log('SOY LA RESPUESTA',res);
      this.exam = 1;
    });

  }

  calificacion(event) {
    this.calificacionVal = event.detail.value;
  }

  enviarMensaje() {
    if (this.calificacionVal) {
      this.share.enviarComentarioIPutuacion(this.data.id, this.userinfo, this.menajeNuevo, this.calificacionVal).subscribe(data => {
        this.share.getComentariosCurso(this.data.id).subscribe(info => {
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
        'Puedes calificar desplazandote y seleccionando un valor entre 1 y 10 ',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  getcursos(userid: any) {
    this.share.getCursos().subscribe(info => {
      console.log(info);
      this.cursos = info.data;
    });
  }

  toggleItem(index, leccionesIndex) {
    this.cursos[index].lessons[leccionesIndex].open = !this.cursos[index].lessons[leccionesIndex].open;
    this.router.navigate(['/users/entrena/vercurso/verleccion']);
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
      console.log('SOY RVal',rval, tma);
      if (rval === tma){
        console.log('entre lisgto para examen');
        this.share.varExam.next('Listo para el examen');
      }else{
        this.share.updateorder(order);
      }
    });
    let url = 'http://venki.3utilities.com/' + doc;
    this.previewAnyFile.preview(url).then(() => {

    }, (err) => {
      console.log(JSON.stringify(err));
    });
  }

  startVideo(lectionName: any, video: any,  order: any, tma: any) {
    
    const dataObjVid = {
      name: lectionName,
      vidInfo: video,
      orderid: order,
      tm: tma
    };
    this.pObjecto.setData(dataObjVid);
    //////////////////////////////////////////
    this.pObjectVideo.setData(dataObjVid);

    //////////////////////////////////////////

    console.log('es esto', dataObjVid);
    this.router.navigate(['/users/entrena/vercurso/verleccion/vidplayer/']);

  }

  audioPlayer(lectionName: any, content: any, order: any, tma: any) {
    console.log('TAMAÑO', tma);
    const dataaud = 'http://venki.3utilities.com/' + content;
    const dataObj = {
      name: lectionName,
      audioInfo: dataaud,
      orderid: order,
      tm: tma
    };
    
    this.pObjecto.setData(dataObj);
    //this.infoVideo.emit(lectionName, this.video, order,tma);
    this.router.navigate(['/users/entrena/vercurso/verleccion/audioplayer']);
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

  verRecursos(recursos: any){
    console.log(recursos);
  }

  examen(exam: any){
    console.log('EXAMEN', exam);
    const dataObj = {
      examen: exam,
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/entrena/examen/']);
  }

}

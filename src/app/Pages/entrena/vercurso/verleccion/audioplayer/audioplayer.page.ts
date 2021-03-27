import { PassNameLessonsService } from './../../../../../_services/pass-name-lessons.service';
import { PassObjectAuxService } from './../../../../../_services/pass-object-aux.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Howl } from 'howler';
import { IonRange } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectVideoService } from 'src/app/_services/pass-object-video.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-audioplayer',
  templateUrl: './audioplayer.page.html',
  styleUrls: ['./audioplayer.page.scss'],
})
export class AudioplayerPage implements OnInit {

  data: any;
  aud: Array<any>;
  activetrack;
  player: Howl = null;
  isPlaying = false;
  progress = 0;
  audioname;
  orderID: any;
  tam: any;
  
  //-------------------var video------------
  dataVid: any;
  cursos: any[]=[];
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
  orderStorage: any;
  exam = 0;
  color:string;
  progreso: any;
  indexLessons: number;
  
  @ViewChild('range', {static: false})  range: IonRange;
 constructor(
    private router: Router,
    private pObjecto: PassObjectService,
    private PObjectAux: PassObjectAuxService,
    private share: ShareserviceService,
    private pObjectoVideo: PassObjectVideoService,
    private PObjecIndex: PassNameLessonsService,
    private loadingService: LoadingService   ,
    private snackbar: MatSnackBar
    ) { }


  ngOnInit() {

    let info = this.pObjecto.getNavData();
    if(info) {
      this.share.guardarLeccionActiva(info);
      this.data = info.audioInfo;
      this.audioname = info.name;
      this.orderID = info.orderid;
      this.tam = info.tm;
      this.aud = [];
      this.aud.push(this.data);
    }
    this.activetrack =  this.aud;
    this.share.verorder().then( rval => {
      if (rval === this.tam){
    this.share.varExam.next('Listo para el examen');
      } else {
        this.share.updateorder(this.orderID);
      }
    });
    
    this.indexLessons = this.PObjecIndex.getData();
    const informacion = this.pObjectoVideo.getNavData();
    this.color=informacion.color;
    this.data = informacion.infoCurso;
    this.userinfo = informacion.userInf;
    this.course = informacion.course.name;
    this.courseID = informacion.infoCurso.id;

    this.getCourse();
  }

  getCourse() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCursoEspecifico(this.data.id).subscribe(async infodt => {
      this.info = infodt.data;
      this.share.getComentariosCurso(this.data.id).subscribe(info => {
        this.comentariosGeneral = info.data;
        this.share.getCursosUsuario(this.userinfo.id).subscribe(dataCurso => {
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

  start(track: any) {
    const that = this;
    if (this.player) {
      this.player.stop()
    }
    this.player = new Howl({
      src: [track],
      html5: true,
      onplay: () => {
        this.isPlaying = true;
        this.activetrack = track;
        this.updateProgress();
      },
      onend: () => {
        this.player.stop();
      },
      onloaderror: function() {
        that.mostrarmensaje('Error al cargar el audio', 'Error', 'red-snackbar');
      }
    });
    this.player.play();
  }

  toggleplayer(pause, active) {
    if (this.player) {
      this.isPlaying = !pause;
      if (pause) {
        this.player.pause();
      } else {
        if (this.player === null) {
          console.group(active);
          this.start(active);
        } else {
          this.player.play();
        }
      }
    } else {
      this.mostrarmensaje('Error al cargar el audio', 'Error', 'red-snackbar');
    }
  }

  next() {
    let index = this.aud.indexOf(this.activetrack);
    if (index != this.aud.length - 1) {
      this.start(this.aud[index + 1]);
    } else {
      this.start(this.aud[0]);
    }
  }

  prev() {
    let index = this.aud.indexOf(this.activetrack);
    if (index > 0) {
      this.start(this.aud[index - 1]);
    } else {
      this.start(this.aud[this.aud.length - 1]);
    }
  }

  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  startVideo(lectionName: any, video: any,  order: any, tma: any) {
    const dataObj = {
      name: lectionName,
      vidInfo: video,
      orderid: order,
      tm: tma
    };
    this.pObjectoVideo.setData(dataObj);
    this.router.navigate(['/users/entrena/vercurso/verleccion/vidplayer/']);
  }
  
  anterior(){
    this.pObjecto.setData(this.PObjectAux.getNavData());
    this.pObjectoVideo.setData(this.PObjectAux.getNavData());
    this.router.navigate(['/users/entrena/vercurso/verleccion/']);
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}

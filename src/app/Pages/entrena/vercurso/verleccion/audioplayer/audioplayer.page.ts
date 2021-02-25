import { PassObjectAuxService } from './../../../../../_services/pass-object-aux.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Howl } from 'howler';
import { IonRange } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectVideoService } from 'src/app/_services/pass-object-video.service';


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
  
  @ViewChild('range', {static: false})  range: IonRange;
 constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pObjecto: PassObjectService,
    private PObjectAux: PassObjectAuxService,
    private share: ShareserviceService,
    private pObjectoVideo: PassObjectVideoService   
    ) {
}


  ngOnInit() {
    let info = this.pObjecto.getNavData();
    console.log('lo que nec',info);
    this.share.guardarLeccionActiva(info);
    this.data = info.audioInfo;
    this.audioname = info.name;
    this.orderID = info.orderid;
    this.tam = info.tm;
    this.aud = [];
    this.aud.push(this.data);
    //console.log(info.toString(),' entro al audio player');
    this.activetrack =  this.aud;
    this.share.verorder().then( rval => {
      if (rval === this.tam){
    this.share.varExam.next('Listo para el examen');
      } else {
        this.share.updateorder(this.orderID);
      }
    });
    
    //----------------
    const informacion = this.pObjectoVideo.getNavData();
    console.log('info en audioplay',informacion);
    this.color=informacion.color;
    this.data = informacion.infoCurso;
    this.userinfo = informacion.userInf;
    this.course = informacion.course.name;
    this.courseID = informacion.infoCurso.id;
    console.log('info curso',this.data);
    this.share.guardarCursoActiva(informacion);
    this.share.getCursoEspecifico(this.data.id).subscribe(async infodt => {
      this.info = infodt.data;
      console.log(this.info,'trae la info del curso especifico');
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
              console.log('info curso audioplay:', this.cursos);

            });
      });
    });
  }

  start(track: any) {
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
      }
    });
    this.player.play();
  }

  toggleplayer(pause, active) {
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

  //new
  getcursos(userid: any) {
    this.share.getCursos().subscribe(info => {
      console.log(info + ' info que necesito');
      this.cursos = info.data;
    });
  }

  startVideo(lectionName: any, video: any,  order: any, tma: any) {
    console.log('Video', lectionName);
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
}

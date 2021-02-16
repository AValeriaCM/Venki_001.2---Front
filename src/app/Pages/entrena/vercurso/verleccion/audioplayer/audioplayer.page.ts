<<<<<<< HEAD:src/app/Pages/entrena/audioplayer/audioplayer.page.ts
import { PassObjectVideoService } from './../../../_services/pass-object-video.service';
import { Component, OnInit, ViewChild } from '@angular/core';
=======
import { VerleccionPage } from './../verleccion.page';
import { Component, Input, OnInit, ViewChild, Output } from '@angular/core';
>>>>>>> 687ce3ccac498b1cafb17c986f055ebd5b3bba98:src/app/Pages/entrena/vercurso/verleccion/audioplayer/audioplayer.page.ts
import { ActivatedRoute, Router } from '@angular/router';
import { Howl } from 'howler';
import { IonRange } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';


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
  cursos: any[] = [];
  tam: any;
<<<<<<< HEAD:src/app/Pages/entrena/audioplayer/audioplayer.page.ts
  
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
=======

  tituloVideo: any;
  urlVideo: any;
  ordenVideo: any;
  tamanoVideo: any;

  @Output() infoVideo: any;
  /*@Input() vi: any;
  @Input()  order: any;
  @Input() tma: any;  */

  course: any;
  courseID: any;
  CourseLessonID: any;

  @ViewChild('range', { static: false }) range: IonRange;
>>>>>>> 687ce3ccac498b1cafb17c986f055ebd5b3bba98:src/app/Pages/entrena/vercurso/verleccion/audioplayer/audioplayer.page.ts
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pObjecto: PassObjectService,
<<<<<<< HEAD:src/app/Pages/entrena/audioplayer/audioplayer.page.ts
    private share: ShareserviceService,
    private pObjectoVideo: PassObjectVideoService   
    ) {
=======
    private pObjectVideo: PassObjectService,
    private share: ShareserviceService
  ) {
>>>>>>> 687ce3ccac498b1cafb17c986f055ebd5b3bba98:src/app/Pages/entrena/vercurso/verleccion/audioplayer/audioplayer.page.ts
  }


  ngOnInit() {
    this.infoVideo = this.pObjectVideo.getNavData();
    const dataObjVideo ={
      name: this.infoVideo.lectionsName,
      vidInfo: this.infoVideo.video,
      orderid: this.infoVideo.order,
      tm: this.infoVideo.tam
    }


    let info = this.pObjecto.getNavData();
    console.log('lo que nec',info);
    this.share.guardarLeccionActiva(info);
    this.data = info.audioInfo;
    this.audioname = info.name;
    this.orderID = info.orderid;
    this.tam = info.tm;
    this.aud = [];
    this.aud.push(this.data);
<<<<<<< HEAD:src/app/Pages/entrena/audioplayer/audioplayer.page.ts
    //console.log(info.toString(),' entro al audio player');
    this.activetrack =  this.aud;
    this.share.verorder().then( rval => {
      if (rval === this.tam){
=======
    this.activetrack = this.aud;
    
    this.share.verorder().then(rval => {
      if (rval === this.tam) {
>>>>>>> 687ce3ccac498b1cafb17c986f055ebd5b3bba98:src/app/Pages/entrena/vercurso/verleccion/audioplayer/audioplayer.page.ts
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

<<<<<<< HEAD:src/app/Pages/entrena/audioplayer/audioplayer.page.ts
  continue(){
    //this.startVideo();
    this.router.navigate(['/users/entrena/vidplayer/']);
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
    this.router.navigate(['/users/entrena/vidplayer/']);
=======
  continue() {
    console.log('nombre: ',this.infoVideo.name);
    console.log('vidInfo: ',this.infoVideo.orderid);

    const dataObjVid = {
      name: this.infoVideo.name,
      /*vidInfo: video,
      orderid: order,
      tm: tma*/
    };
    this.pObjecto.setData(dataObjVid);

    console.log('es esto', dataObjVid);
    this.router.navigate(['/users/entrena/vercurso/verleccion/vidplayer/']);
 //this.router.navigate(['/users/entrena/vercurso/verleccion/vidplayer/']);

>>>>>>> 687ce3ccac498b1cafb17c986f055ebd5b3bba98:src/app/Pages/entrena/vercurso/verleccion/audioplayer/audioplayer.page.ts
  }

}

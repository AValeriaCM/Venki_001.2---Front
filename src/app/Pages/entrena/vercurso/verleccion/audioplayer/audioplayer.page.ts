import { VerleccionPage } from './../verleccion.page';
import { Component, Input, OnInit, ViewChild, Output } from '@angular/core';
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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pObjecto: PassObjectService,
    private pObjectVideo: PassObjectService,
    private share: ShareserviceService
  ) {
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
    this.share.guardarLeccionActiva(info);
    this.data = info.audioInfo;
    this.audioname = info.name;
    this.orderID = info.orderid;
    this.tam = info.tm;
    this.aud = [];
    this.aud.push(this.data);
    this.activetrack = this.aud;
    
    this.share.verorder().then(rval => {
      if (rval === this.tam) {
        this.share.varExam.next('Listo para el examen');
      } else {
        this.share.updateorder(this.orderID);
      }
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

  }

}

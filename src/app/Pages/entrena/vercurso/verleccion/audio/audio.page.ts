import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRange } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { PassNameLessonsService } from 'src/app/_services/pass-name-lessons.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { Howl } from 'howler';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit, OnDestroy {

  @ViewChild('range', {static: false})  range: IonRange;

  token = null;
  index = null;
  user = null;
  id = null;

  course = null;
  audio = null;

  nameCourse = null;
  progress = 0;
  player: Howl = null;
  isPlaying = false;
  basePath = `${environment.HOST}`;

  informacion: any;
  leccion: number;
  order = null;


  constructor(
    private auth: AuthService,
    private pObjectIndex: PassNameLessonsService,
    private pObjecto: PassObjectService,
    private loadingService: LoadingService,
    private share: ShareserviceService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.leccion = this.pObjectIndex.getData();
    this.informacion = this.pObjecto.getNavData();
    this.share.verorder().then( order => {
      this.order = order;
    });
  }

  ngOnDestroy() {
    this.player.pause();
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.loadPage();
    });
  }

  loadPage() {
    this.index = this.pObjectIndex.getData();
    const informacion = this.pObjecto.getNavData();
    this.user = informacion.userInf;
    this.id = informacion.infoCurso.id;
    this.share.guardarCursoActiva(informacion);
    this.getCourse();
  }

  getCourse() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCursosUsuario(this.user.id, this.token).subscribe( resp => {
      this.loadingService.loadingDismiss();
      let course = resp.data.find( (course: any) => course.id === this.id );
      this.course = course.lessons[this.index];
      this.nameCourse = this.course.name;
      const resource = this.course.resources.find( (resource: any) => resource.order === this.order );
      this.audio = resource.audio;
      this.start(this.audio);
    });
  }

  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  prev() {
    this.start(this.audio);
  }

  next() {
    this.start(this.audio);
  }

  start(track: any) {
    const that = this;
    if (this.player) {
      this.player.stop()
    }
    this.player = new Howl({
      src: [this.basePath + track],
      html5: true,
      volume: 1,
      onplay: () => {
        this.isPlaying = true;
        this.audio = track;
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

  toggleplayer(pause: any, active: any) {
    if (this.player) {
      this.isPlaying = !pause;
      if (pause) {
        this.player.pause();
      } else {
        if (this.player === null) {
          this.start(active);
        } else {
          this.player.play();
        }
      }
    } else {
      this.mostrarmensaje('Error al cargar el audio', 'Error', 'red-snackbar');
    }
  }

  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  goContent() {
    this.pObjectIndex.setData(this.leccion);
    this.pObjecto.setData(this.informacion);
    this.share.varorder.next('true');
    this.router.navigate(['/users/entrena/vercurso/verleccion/contenido']);
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }

}

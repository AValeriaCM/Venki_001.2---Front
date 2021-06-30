import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { PassNameLessonsService } from 'src/app/_services/pass-name-lessons.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit, OnDestroy {

  token: any;
  index: number;
  user = null;
  id = null;
  course = null;

  informacion: any;
  leccion: number;
  order = 1;

  alert: any;
  quizHistory = [];
  cursoGeneral = null
  isReload = false;

  subscription: Subscription;
  

  constructor(
    private auth: AuthService,
    private pObjectIndex: PassNameLessonsService,
    private pObjecto: PassObjectService,
    private loadingService: LoadingService,
    private share: ShareserviceService,
    private router: Router,
    private alertController: AlertController,
    private snackbar: MatSnackBar
  ) { 
    this.reload();
    this.share.retornarQuiz().then( resp => {
      if(resp) {
        this.quizHistory = resp;
      }
    });
  }

  ngOnInit() {
    this.getToken();
    this.leccion = this.pObjectIndex.getData();
    this.informacion = this.pObjecto.getNavData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  reload() {
    this.subscription = this.share.varorder.subscribe( res => {
      if(res) {
        this.share.verorder().then( order => {
          this.order = order + 1;
          this.share.updateorder(order);
          this.loadPage();
        });
      }
    });
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
      this.cursoGeneral = course;
      this.course = course.lessons[this.index];
      this.share.guardarLeccionActiva(this.course);
      const nextResource = this.course.resources.find( (resource: any) => resource.order === this.order );

      if(nextResource) {
        this.pObjectIndex.setData(this.leccion);
        this.pObjecto.setData(this.informacion);
  
        if(nextResource.audio) {
          this.router.navigate(['/users/entrena/vercurso/verleccion/audio']);
        } 
  
        if(nextResource.document) {
          this.router.navigate(['/users/entrena/vercurso/verleccion/texto']);
        }
  
        if(nextResource.video) {
          this.router.navigate(['/users/entrena/vercurso/verleccion/video']);
        }

        if(nextResource.quiz) {
          this.router.navigate(['/users/entrena/vercurso/verleccion/quiz']);
        }

      } else {
        this.share.updateorder(null);
        if(this.quizHistory.length > 0) {
          this.share.guardarquices(this.quizHistory, this.token).subscribe( resp => {
            this.share.removerQuiz();
          }, error => {
            this.mostrarmensaje('Ah ocurrido un error, comuniquese con el administrador', 'Error', 'red-snackbar');
          });
        }

        this.loadingService.loadingPresent({spinner: "circles" });
        this.share.obtenerLeccionesUsuario(this.course.course_id, this.token, this.user.id).subscribe(data => {
          this.loadingService.loadingDismiss();
          const validate = data.data.find( (o: any) => o.id_lesson === this.course.id && o.course_id === this.course.course_id);
          if(validate) {
            this.share.guardarLeccionActiva(null);
            this.alertProgreso();
            this.share.varLeciones.next();
            this.router.navigateByUrl('/users/entrena/vercurso');
          } else {
            const leccionActual = {
              id_user: this.user.id,
              id_course: this.course.course_id,
              id_lesson: this.course.id
            }
            this.loadingService.loadingPresent({spinner: "circles" });
            this.share.guardarleccion(leccionActual, this.token).subscribe( resp => {
              this.loadingService.loadingDismiss();
              this.share.guardarLeccionActiva(null);
              if( (this.cursoGeneral.lessons.length - 1 ) === data.data.length) {
                this.share.varExamen.next();
                this.router.navigateByUrl('/users/entrena/vercurso/verleccion/examen');
              } else {
                this.alertProgreso();
                this.share.varLeciones.next();
                this.router.navigateByUrl('/users/entrena/vercurso');
              }
            }, error => {
              this.loadingService.loadingDismiss();
              this.mostrarmensaje('Ah ocurrido un error, comuniquese con el administrador', 'Error', 'red-snackbar');
            });
          }
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }
    });
  }

  async alertProgreso() {
    this.alert = await this.alertController.create({
      header: 'Felicidades',
      subHeader:
        'Terminaste la lección',
      message:
        'Pasa a la siguiente lección para incrementar tu progreso',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}

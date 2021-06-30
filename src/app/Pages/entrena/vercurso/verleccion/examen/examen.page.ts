import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertController, IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassNameLessonsService } from 'src/app/_services/pass-name-lessons.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.page.html',
  styleUrls: ['./examen.page.scss'],
})
export class ExamenPage implements OnInit, OnDestroy {

  @ViewChild('slider', { static: false }) slidefromHtml: IonSlides;

  token: any;
  index: number;
  user = null;
  id = null;

  preguntas = [];
  alert: any;

  informacion: any;
  leccion: number;

  subscription: Subscription;

  constructor(
    private auth: AuthService,
    private pObjectIndex: PassNameLessonsService,
    private pObjecto: PassObjectService,
    private loadingService: LoadingService,
    private share: ShareserviceService,
    private router: Router,
    private alertController: AlertController,
    private snackbar: MatSnackBar,
    private log: LoginService
  ) { 
    this.getToken();
    this.refreshPage();
  }

  ngOnInit() {
    this.leccion = this.pObjectIndex.getData();
    this.informacion = this.pObjecto.getNavData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshPage() {
    this.subscription = this.share.varExamen.subscribe( res => {
      this.loadPage();
    });
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.log.logdataInfData(this.token).subscribe( infoUser => {
        this.user = infoUser;
      });
      this.loadPage();
    });
  }

  loadPage() {

    this.share.obtenerCursos(this.token).subscribe( data => {

      console.log('data', data);
      console.log('this.leccion', this.leccion);
      console.log('this.informacion', this.informacion);

      if(data.data.length > 0) {
        const o = data.data.find( c => c.id === this.leccion)
        if(o) {
          if(o.examen) {
            this.share.obtenerExamenes(o.examen.id, this.token).subscribe( resp => {
              if(resp.data.length > 0) {
                this.preguntas = resp.data;
                this.preguntas.map( pregunta => {
                  pregunta.id_user = this.user.id;
                  if(pregunta.tiporespuesta === 'Multiple') {
                    pregunta.respuestas = pregunta.opciones.split(",");
                  }
                });
                setTimeout(()=> {
                  this.slidefromHtml.lockSwipes(false);
                }, 100);
              }
            }, error => {
              this.mostrarmensaje('Ah ocurrido un error, comuniquese con el administrador', 'Error', 'red-snackbar');
            });
          } else {
            this.mostrarmensaje('El curso no tiene configurado un examen', 'Error', 'red-snackbar');
          }
        } else {
          this.mostrarmensaje('Ah ocurrido un error, comuniquese con el administrador', 'Error', 'red-snackbar');
        }
      } else {
        this.mostrarmensaje('No existen cursos', 'Error', 'red-snackbar');
      }
    }, error => {
      this.mostrarmensaje('Ah ocurrido un error, comuniquese con el administrador', 'Error', 'red-snackbar');
    })
  }

  checkSlide()  {
    this.slidefromHtml.getActiveIndex().then(id => {
      if(id !== 0) {
        if(this.preguntas[id-1]) {
          if(this.preguntas[id-1].answer) {
            this.slidefromHtml.lockSwipeToNext(false);
          } else {
            this.slidefromHtml.lockSwipeToNext(true);
          }
        } else {
          this.slidefromHtml.lockSwipeToNext(true);
        }
      } else {
        this.slidefromHtml.lockSwipeToNext(false);
      }
    });
  }

  block() {
    this.slidefromHtml.lockSwipes(true);
  }

  validate(respuesta: any) {
    this.slidefromHtml.lockSwipes(false);
    if(respuesta) {
      this.slidefromHtml.lockSwipeToNext(false);
    } else {
      this.slidefromHtml.lockSwipeToNext(true);
    }
  }

  post() {
    var json = [];
    this.preguntas.map( pregunta => {
      json.push({
        id_user: pregunta.id_user,
        id_examen: pregunta.id_examen,
        pregunta: pregunta.pregunta,
        respuesta: pregunta.answer,
        valor: pregunta.valor
      });
    }); 
    if(json.length > 0) {
      this.share.guardarExamenes(json, this.token).subscribe( resp => {
        this.alertProgreso();
        this.share.varLeciones.next();
        this.router.navigateByUrl('/users/entrena/vercurso');
      }, error => {
        this.mostrarmensaje('Ah ocurrido un error, comuniquese con el administrador', 'Error', 'red-snackbar');
      });
    } else {
      this.mostrarmensaje('Ah ocurrido un error, comuniquese con el administrador', 'Error', 'red-snackbar');
    }
  }

  async alertProgreso() {
    this.alert = await this.alertController.create({
      header: 'Felicidades',
      subHeader:
        'Terminaste el examen',
      message:
        'Espera a que tu examen sea calificado y ve a la sección de trofeos e insignias para descubrir tu trofeo',
      buttons: ['OK'],
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

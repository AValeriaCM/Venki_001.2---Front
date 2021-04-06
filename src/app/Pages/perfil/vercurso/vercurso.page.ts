import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { AlertController, IonContent } from '@ionic/angular';
import { LoadingService } from 'src/app/_services/loading.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-vercurso',
  templateUrl: './vercurso.page.html',
  styleUrls: ['./vercurso.page.scss'],
})
export class VercursoPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  data: any;
  prueba: any;
  info: any;
  calificacionVal: any;
  menajeNuevo = '';
  userinfo: any;
  alert: any;
  comentariosGeneral: any[] = [];
  infomsg: any;
  token: any;
  
  constructor(
    private route: ActivatedRoute,
    private share: ShareserviceService,
    public alertController: AlertController,
    private loadingService: LoadingService,
    private auth: AuthService
    ) {
    this.getToken();
    this.route.queryParams.subscribe( params => {
      if ( params && params.info  && params.userinf) {
        this.data = params.info;
        this.userinfo = JSON.parse(params.userinf);
      }
    });
  }

  ngOnInit() {
    this.prueba = JSON.parse(this.data);
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp
      this.getCourse();
    });
  }

  getCourse() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCursoEspecifico(this.prueba, this.token).subscribe( async infodt => {
      this.info = infodt.data;
      this.share.getComentariosCurso(this.prueba, this.token).subscribe( info =>  {
        this.comentariosGeneral = info.data;
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  calificacion(event){
    this.calificacionVal = event.detail.value;
  }

  enviarMensaje(){
    if (this.calificacionVal) {
      this.share.enviarComentarioIPutuacion(this.prueba, this.userinfo, this.menajeNuevo, this.calificacionVal, this.token).subscribe( data => {
        this.share.getComentariosCurso(this.prueba, this.token).subscribe( info =>  {
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
        'Por favor califica nuestros cursos es importante',
      message:
        'Puedes calificar usando desplazandote y seleccionanaod un valor entre 1 y 10 ',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }
}

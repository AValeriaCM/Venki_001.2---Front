import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { AlertController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-vercurso',
  templateUrl: './vercurso.page.html',
  styleUrls: ['./vercurso.page.scss'],
})
export class VercursoPage implements OnInit {

  data: any;
  prueba: any;
  info;
  calificacionVal;
  menajeNuevo = '';
  userinfo;
  alert: any;
  img = 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png';
  comentariosGeneral: any[] = [];
  infomsg: any;
  @ViewChild(IonContent) content: IonContent;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private share: ShareserviceService,
              public alertController: AlertController,) {
    this.route.queryParams.subscribe( params => {
      if ( params && params.info  && params.userinf) {
        this.data = params.info;
        this.userinfo = JSON.parse(params.userinf);
      }
    });
  }

  ngOnInit() {
    this.prueba = JSON.parse(this.data);
    this.share.getCursoEspecifico(this.prueba).subscribe( async infodt => {
      this.info = infodt.data;
      this.share.getComentariosCurso(this.prueba).subscribe( info =>  {
        this.comentariosGeneral = info.data;
      });
    });
  }

  calificacion(event){
    this.calificacionVal = event.detail.value;
  }

  enviarMensaje(){
    if (this.calificacionVal){
      this.share.enviarComentarioIPutuacion(this.prueba, this.userinfo, this.menajeNuevo, this.calificacionVal).subscribe( data => {
        this.share.getComentariosCurso(this.prueba).subscribe( info =>  {
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

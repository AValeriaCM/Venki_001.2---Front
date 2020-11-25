import { Component, OnInit, ViewChildren, ViewChild, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, AlertController } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';

@Component({
  selector: 'app-vermas',
  templateUrl: './vermas.page.html',
  styleUrls: ['./vermas.page.scss'],
})
export class VermasPage implements OnInit {

  comments = [
    {
      id: 1,
      id_user: 3,
      user: 'Julian',
      msg: 'Es genial',
      currentTime: 155409956000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    },
    {
      id: 2,
      id_user: 4,
      user: 'Fabian',
      msg: 'Ayuda mucho a todo lo que se necesita',
      currentTime: 155401056000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    },
    {
      id: 3,
      id_user: 5,
      user: 'Julia',
      msg: 'No es de mi agrado',
      currentTime: 155401086000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    },
    {
      id: 4,
      id_user: 6,
      user: 'Nicolas',
      msg: 'falta más explicacion',
      currentTime: 155401106000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    }
  ];



  data: any;
  vid: Array<any>;
  newMsg = '';
  usuarioActual = 'Andres';

  @ViewChild(IonContent) content: IonContent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private render: Renderer2,
    public alertController: AlertController,
    private pObjecto: PassObjectService) {
  }

  ngOnInit() {
    let info = this.pObjecto.getNavData();
    this.data  = info.vidinfo;
    this.vid = [];
    this.vid.push(this.data);
  }


  enviarMsg() {
    this.comments.push({
      id: 1,
      id_user: 3,
      user: this.usuarioActual,
      currentTime: new Date().getTime(),
      msg: this.newMsg,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    });

    this.newMsg = '';

    setTimeout(() => {
      this.content.scrollToBottom(200);
    });
  }


  async videoEnd() {
    const alert = await this.alertController.create({
      header: 'HEY!',
      subHeader: 'No olvides que puedes realizar un test cuando quieras',
      message: 'Puedes ver tu progreso en el apartado de tu perfil en la seccion de metricas',
      buttons: ['Acepto']
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 3000);
  }

}

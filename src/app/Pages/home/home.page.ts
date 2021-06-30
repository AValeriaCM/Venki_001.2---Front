import { ImgPrevPage } from './img-prev/img-prev.page';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import * as shuffleArray from 'shuffle-array';
import { LoginService } from 'src/app/_services/login.service';
import { Image } from 'src/app/_model/Image';
import { forkJoin, Observable } from 'rxjs';
import { LoadingService } from 'src/app/_services/loading.service';
import { environment } from 'src/environments/environment';
import { ImagesService } from 'src/app/_services/images.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  encourageMsg = [
    'Es un placer tenerte de vuelta te extrañamos',
    'Recuerda que puedes hacer uso del diagnostico si aun no lo haces',
    'No te rindas con tus cursos, recuerda siempre culminarlos. ¡Esa la meta!'
  ];
  imageSelect: Image;
  alert: any;
  urlP:string;
  user = 'user119572637';
  usertk = null;
  miactividad = 0;
  cursoActivo = null;
  actividadDiaria = null;
  leccionActiva = null;
  message_header: string;
  basePath = `${environment.HOST}`;

  emotion = '';
  token: any;

  imageHome = null;
  imageDescription = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private share: ShareserviceService,
    private pObjecto: PassObjectService,
    private localN: LocalNotifications,
    private log: LoginService,
    private modelcontroller: ModalController,
    private loadingService: LoadingService,
    private imagesService: ImagesService,
    private alertController: AlertController
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.imageSelect = new Image();
    this.getCurrentHour();
    this.getActiveLesson();
    this.getActiveCourse();
    this.localNotification();
  }

  showMessageCoins() {
    this.alertController.create({
      header: "MAGIN's",
      message: '<div class="img-alert"><img src="../../../assets/home/money.png" alt="g-maps"></div>Suma más monedas oficiales por medio de la interacción y socialización diaria en la aplicación.',
      buttons: ['¡Seguir Sumando!'],
      cssClass: 'coins'
    }).then(alert => alert.present());
  }

  getImages() {
    this.imagesService.getImages(this.token).subscribe( (resp: any) => {
      this.imageHome = resp.data.find( (image: any) => image.type === 2 );
      if(this.imageHome) {
        this.imageDescription = this.imageHome.description;
        this.imageHome = `${this.basePath}${this.imageHome.url}`;
      }
    }, error => {
    });
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.loadData();
      this.getDataInfo();
    });
  }
  getDataInfo() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        this.getMiactividad(this.usertk.id);
      });
    });
  }

  getActiveCourse() {
    this.share.getcursoActivo().then( info => {
      this.cursoActivo = info;
    });
  }

  getActiveLesson() {
    this.share.getleccionActiva().then( resp => {
      this.leccionActiva = resp;
    });
  }

  getData(): Observable<any> {
    let activity = this.share.getaactividadesDiaria(this.token);
    return forkJoin([activity]);
  }


  async loadData() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.getData().subscribe(res => {
      this.actividadDiaria = res[0].data.activity;
      this.loadingService.loadingDismiss();
    }, err => {
      this.loadingService.loadingDismiss();
    }); 
  }

  getCurrentHour() {
    var today = new Date()
    var curHr = today.getHours()
    if (curHr < 12) {
      this.message_header = "Buenos días";
    } else if (curHr < 18) {
      this.message_header = "Buenas tardes";
    } else {
      this.message_header = "Buenas noches";
    }
  }

  retomarleccion(){
    this.pObjecto.setData(this.cursoActivo);
    this.router.navigate(['/users/entrena/vercurso/']);
  }

  localNotification() {
    let titleNotif = 'Mensaje de Venki';
    shuffleArray(this.encourageMsg).forEach((message: any, index: any) => {
      this.localN.schedule({
        id: index,
        title: titleNotif,
        text: message,
        trigger: {
          in: 1 + (index * 2),
          unit: ELocalNotificationTriggerUnit.DAY,
        }
      });
    });
  }

  async imageView(imag: any) {
    const modal = await this.modelcontroller.create({
        component: ImgPrevPage,
        componentProps: {
          img: imag
        }
    });
    await modal.present();
  }

  getMiactividad(userid: any) {
    this.share.getActividadUsuario(userid, this.token).subscribe(info => {
      this.miactividad = info.data.length;
      this.getImages();
    });
  }

  diagnosticoRedirect(info: number, id: number) {
    let dataObj = {
      idprofile: info,
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/diagnostico-inicio']);
  }

  recomedacionesRedirect(id: any){
    let dataObj = {
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/recomendaciones/']);
  }

  opinarSobreActividad(act: any) {
    let dataObj = {
      actividad: act
    };
    this.pObjecto.setData(dataObj);
    this.share.varDesafio.next('mostrar desafio');
    this.router.navigate(['/users/social']);
  }

  goTraing() {
    this.router.navigate(['/users/entrena']);
  }

  savefeeling(feeling: any) {
    this.emotion = feeling;
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.savefeeling(this.usertk.id, feeling, this.token).subscribe( resp => {
      this.loadingService.loadingDismiss();      
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }
}

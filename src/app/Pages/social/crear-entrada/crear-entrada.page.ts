import { Component, OnInit } from '@angular/core';
import { LoadingController, ActionSheetController, AlertController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { Camera } from '@ionic-native/camera/ngx';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/_services/loading.service';


@Component({
  selector: 'app-crear-entrada',
  templateUrl: './crear-entrada.page.html',
  styleUrls: ['./crear-entrada.page.scss'],
})
export class CrearEntradaPage implements OnInit {
  colors = ['#3dc2ff', '#3880ff', '#eb445a'];
  sliderImgOption = {
    zoom: false,
    slidesPerView: 1,
    cemteredSlides: true,
    spaceBetween: 0
  };
  usertk = null;
  loading: any;
  textareainput: any;
  photos: Array<any>;
  alert: any;
  idAction: number;
  sFotos: Array<any>;
  actividad;

  constructor(
    private camara: Camera,
    private actionSheetcontroller: ActionSheetController,
    private log: LoginService,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private share: ShareserviceService,
    private imagePick: ImagePicker,
    private alertController: AlertController,
    private pObjecto: PassObjectService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    const informacion = this.pObjecto.getNavData();
    this.idAction = informacion.idAction;
    this.actividad = informacion.actividad;
    this.share.varDesafio.subscribe( res => {
      const informacion = this.pObjecto.getNavData();
      this.actividad = informacion.actividad;
    });

    this.sFotos = [];
    this.photos = [];
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
      });
    });

  }

  vistaHolder(idAction: number) {
    if (idAction === 1) {
      return '¿Que está pasando?';
    }
    if (idAction === 2) {
      return '¿Qué quieres socializar?';
    }
    if (idAction === 3) {
      return '¡Reta a la Comunidad! ¡Crea un desafío!';
    }
  }

  async selccionImg(){
    const acctionSheet = await this.actionSheetcontroller.create({
      header: 'Selecciona Una Imagen',
      buttons: [
        {
          text: 'Galeria',
          icon: 'image-outline',
          handler: () => {
            this.usarGaleria();
          }
        },
        {
          text: 'Camara',
          icon: 'camera-outline',
          handler: () => {
            this.usarCamara();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await acctionSheet.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando Datos...'
    });
    return this.loading.present();
  }

  usarCamara() {
    this.camara.getPicture({
      sourceType: this.camara.PictureSourceType.CAMERA,
      destinationType: this.camara.DestinationType.FILE_URI,
      correctOrientation: true,
      mediaType: this.camara.MediaType.PICTURE,
      encodingType: this.camara.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
    }).then((res) => {
      const imgsend = 'data:image/jpeg;base64,' + res;
      this.photos.push({imagen: imgsend});
    });
  }

  usarGaleria() {
    this.imagePick.getPictures({
      maximumImagesCount: 5,
      width: 1024,
      height: 768,
      outputType: 1
    }).then((results) => {
      for (var i = 0; i < results.length; i++) {
        const imgsend = 'data:image/jpeg;base64,' + results[i];
        this.photos.push({imagen: imgsend});
      }
    });
  }

  Publicar(){

    if(this.textareainput) {
      this.loadingService.loadingPresent({spinner: "circles" });
      if (this.idAction === 1) {
        this.textareainput = '!Informa: ' + this.textareainput;
      }
      if (this.idAction === 2) {
        this.textareainput = '@Comparte: ' + this.textareainput;
      }
      if (this.idAction === 3) {
        this.textareainput = '#Reto: ' + this.textareainput;
      }
      this.share.guardarpost(this.usertk.id, this.textareainput, this.photos).subscribe(  res => {
        this.loadingService.loadingDismiss();
        this.share.varPostUpdate.next('update data');
        this.router.navigate(['/users/social']);
      }, error => {
        this.loadingService.loadingDismiss();
      });
    } else {
      this.alertDespuesTiempo();
    }
  }

  async alertDespuesTiempo() {
    this.alert = await this.alertController.create({
      header: 'HEY!',
      subHeader:
        'Debes Escribir algo',
      message:
        'Dinos que piensas, no puede ir vacio',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  volver(){
    this.actividad = '';
    this.router.navigate(['/users/social']);
  }
}

import { Component, OnInit } from '@angular/core';
import { LoadingController, ActionSheetController, AlertController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/_services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  token: any;

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
    private loadingService: LoadingService,
    private snackbar: MatSnackBar
  ) { 
    this.getToken();
  }

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

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
    });
  }

  vistaHolder(idAction: number) {
    if (idAction === 1) {
      return '¿Como estás entrenando?';
    }
    if (idAction === 2) {
      return ' Muestra cómo compites';
    }
    if (idAction === 3) {
      return '¡Reta a la comunidad! ¡Crea un desafío!';
    }
  }

  async selccionImg() {
    const acctionSheet = await this.actionSheetcontroller.create({
      header: 'Seleccione una imagen',
      cssClass: 'match-item-action-sheet',
      buttons: [
        {
          text: 'Galería',
          icon: 'image-outline',
          handler: () => {
            this.usarGaleria();
          }
        },
        {
          text: 'Cámara',
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

  async usarCamara() {
    if(this.photos.length < 5) {
      const options: CameraOptions = {
        quality: 100,
        correctOrientation: true,
        destinationType: this.camara.DestinationType.DATA_URL,
        encodingType: this.camara.EncodingType.JPEG,
        mediaType: this.camara.MediaType.PICTURE
      }
      await this.camara.getPicture(options).then( (res) => {
          this.photos.push('data:image/jpeg;base64,' + res); 
      }).catch( (error) => {
        if(error == 'No Image Selected') {
          this.mostrarmensaje('No se seleccionó ninguna imagen', 'Error', 'red-snackbar');
        }
      });
    } else {
      this.mostrarmensaje('El máximo de imágenes adjuntas es de 5', 'Error', 'red-snackbar');
    }
  }

  usarGaleria() {
    if(this.photos.length < 5) {
      this.imagePick.hasReadPermission().then( (result) => {
        if( result == false) {
          this.imagePick.requestReadPermission();
        } else if( result == true) {
          this.imagePick.getPictures({
            maximumImagesCount: 5 - this.photos.length,
            quality: 100,
            outputType: 1
          }).then((results) => {
            for (var i = 0; i < results.length; i++) {
              const imgsend = 'data:image/jpeg;base64,' + results[i];
              this.photos.push(imgsend);
            }
          }).catch( (error) => {
            this.mostrarmensaje('Se presento un error al cargar las imágenes, por favor comuníquese con el administrador.', 'Error', 'red-snackbar');
          });
        }
      });
    } else {
      this.mostrarmensaje('El máximo de imágenes adjuntas es de 5', 'Error', 'red-snackbar');
    }
  }

  removeImagen(imagen: any) {
    const index = this.photos.findIndex(img => img === imagen);
    if(index >= 0) {
      this.photos.splice(index, 1);
    }
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }

  Publicar() {
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
      const medias = new Array();
      if(this.photos.length > 0) {
        this.photos.map( media => {
          medias.push({
            image: media
          });
        });
      }
      const form = {
        user_id: this.usertk.id,
        post: this.textareainput,
        medias: medias
      }
      this.share.guardarpost(form, this.token).subscribe(  res => {
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
        'Dinos que piensas, no puede ir vacío',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  volver() {
    this.actividad = '';
    this.router.navigate(['/users/social']);
  }
}

import { Component, OnInit } from '@angular/core';
import { LoadingController, ActionSheetController, AlertController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { Camera } from '@ionic-native/camera/ngx';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-entrada',
  templateUrl: './crear-entrada.page.html',
  styleUrls: ['./crear-entrada.page.scss'],
})
export class CrearEntradaPage implements OnInit {

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
    private file: File,
    private alertController: AlertController,
    private pObjecto: PassObjectService,
    private router: Router
  ) { }

  ngOnInit() {

    const informacion = this.pObjecto.getNavData();
    console.log(informacion);
    this.actividad = informacion.actividad;

    this.share.varDesafio.subscribe( res => {
      const informacion = this.pObjecto.getNavData();
      console.log(informacion);
      this.actividad = informacion.actividad;
    });

    this.sFotos = [];
    this.photos = [];
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
      });
    });

  }

  async selccionImg(){
    const acctionSheet = await this.actionSheetcontroller.create({
      header: 'Selecciona Una Imagen',
      buttons: [
        {
          text: 'Galeria',
          handler: () => {
            this.usarGaleria();
          }
        },
        {
          text: 'Camara',
          handler: () => {
            this.usarCamara();
          }
        },
        {
          text: 'Cancelar',
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
      destinationType: this.camara.DestinationType.DATA_URL,
      correctOrientation: true,
      mediaType: this.camara.MediaType.PICTURE,
      encodingType: this.camara.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
    }).then((res) => {
      const imgsend = 'data:image/jpeg;base64,' + res;
      this.photos.push({imagen: imgsend});
    }).catch(e => {
      console.log(e);
    });
  }

  usarGaleria() {
    this.imagePick.getPictures({
      maximumImagesCount: 5,
      width: 100,
      height: 100,
      outputType: 1
    }).then((results) => {
      results.forEach(element => {
        console.log('elemento', element);
        this.photos.push({imagen:  'data:image/jpeg;base64,' +  element});
      });
    });
  }

  subirVideo() {
    
  }

  Publicar(){
    console.log(this.textareainput, this.photos);
    if (this.textareainput === undefined){
      this.alertDespuesTiempo();
    }else{
      console.log('SFOTOS',this.photos);
      this.share.guardarpost(this.usertk.id, this.textareainput, this.photos).subscribe(  res => {
        console.log(res);
        this.share.varPostUpdate.next('update data');
      });
    }
  }
  
  async alertDespuesTiempo() {
    this.alert = await this.alertController.create({
      header: 'HEY!',
      subHeader:
        'Debes Escribir algo',
      message:
        'Dinos que piensas escribe algo no se puede ir vacio',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  volver(){
    this.actividad = '';
    this.router.navigate(['/users/social/']);
  }
}

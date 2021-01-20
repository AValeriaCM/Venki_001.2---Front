import { ShareserviceService } from './../../_services/shareservice.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { ActionSheetController, AlertController, IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ImageModalPage } from './image-modal/image-modal.page';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { LoginService } from 'src/app/_services/login.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage implements OnInit {


  miactividad: any;

  sliderImgOption = {
    zoom: false,
    slidesPerView: 1.5,
    cemteredSlides: true,
    spaceBetween: 20
  };

  sliderImgOption2 = {
    zoom: false,
    slidesPerView: 1,
    cemteredSlides: true,
    spaceBetween: 0
  };
  usertk = null;
  loading: any;
  textareainputPiensa: any;
  photos: Array<any>;
  alert: any;
  sFotos: Array<any>;
  actividad;
  LikeValue: number;


  msj = [];

  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;

  paginaActual: any;
  ultimaPage: any;
  totalDt: any;

  constructor(
    private route: Router,
    private chatS: ChatServiceService,
    private modelcontroller: ModalController,
    private share: ShareserviceService,
    private pObjecto: PassObjectService,
    private camara: Camera,
    private actionSheetcontroller: ActionSheetController,
    private log: LoginService,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private imagePick: ImagePicker,
    private alertController: AlertController
    ) {
      this.LikeValue = 0;
     }

  ngOnInit() {
    this.chatS.var.subscribe( chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();

    this.share.getpost().subscribe( res => {
      console.log(res);
      this.miactividad = res.data;
      this.paginaActual = res.meta.current_page;
      this.ultimaPage = res.meta.first_page;
      this.totalDt = res.meta.total;
    });

    this.share.varPostUpdate.subscribe( res => {
      console.log(res);
      this.infonitescroll.disabled  = false;
    })

    this.share.varDesafio.subscribe( res => {
      const informacion = this.pObjecto.getNavData();
      console.log('esta es la actividad', informacion);
      this.actividad = informacion.actividad;
      console.log('El objeto de la actividad  es', this.actividad);
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
    this.camara.getPicture({
      sourceType: this.camara.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camara.DestinationType.DATA_URL,
      mediaType: this.camara.MediaType.PICTURE,
      encodingType: this.camara.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      correctOrientation: true,
    }).then((results) => {
        const imgsend = 'data:image/jpeg;base64,' + results;
        this.photos.push({imagen: imgsend});
    });
  }

  subirVideo() {
    
  }

  Publicar(){
    if (this.textareainputPiensa === undefined){
      this.alertDespuesTiempo();
    }else{
      console.log('SFOTOS',this.photos);
      this.share.guardarpost(this.usertk.id, this.textareainputPiensa, this.photos).subscribe(  res => {
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
        'No puedes publicar algo vacío',
      buttons: ['Entendido'],
    });
    await this.alert.present();
  }

  verUser(userdt: any){
    console.log('user enviado', userdt);
    const dataObj = {
      userinfo: userdt
    };
    this.pObjecto.setData(dataObj);
    this.route.navigate(['/users/social/ver-usuario/']);
  }


  imageView(imag: any){
    this.modelcontroller.create({
      component: ImageModalPage,
      componentProps: {
        img: imag
      }
    }).then(model => model.present());
  }

  openChat(){
    this.route.navigate(['/users/chat']);
  }

  crearEntrada(){
    this.route.navigate(['/users/social/crear-entrada/']);
  }

  loadData(event){
    console.log('evento', event);
    this.paginaActual = this.paginaActual + 1;
    setTimeout(() => {
        console.log(this.miactividad.length);

        if (this.miactividad.length >= this.totalDt){
          event.target.complete();
          this.infonitescroll.disabled  = true;
          return;
        }
        this.share.getpostNextPage(this.paginaActual).subscribe( resPg => {
          console.log('Respuesta pagina', resPg);
          console.log('Respuesta pagina', resPg.data);
          resPg.data.forEach(element => {
            this.miactividad.unshift(element);
          });
          event.target.complete();
        });
    }, 2000);
  }

  handleLike(){
    this.LikeValue++;
   }
    
}

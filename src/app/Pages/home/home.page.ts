import { ImgPrevPage } from './img-prev/img-prev.page';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { VimeoserviceService } from 'src/app/_services/vimeoservice.service';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import * as shuffleArray from 'shuffle-array';
import { LoginService } from 'src/app/_services/login.service';
import { ImagesService } from 'src/app/_services/images.service';
import { Image } from 'src/app/_model/Image';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  encourageMsg = [
    'Es un placer tenerte de vuelta Te extrañamos',
    'Recuerda que puedes hacer uso del Diagnostico si aun no lo haces',
    'No te rindas con tus cursos Recuerda Siempre culminarlos  es la meta'
  ];
  imageSelect: Image;
  alert: any;
  urlP:string;
  user = 'user119572637';
  videos;
  albums;
  private primeraves: boolean;
  items = [];
  slid = true;
  msj = [];
  images: Array<Image>=new Array();
  usertk;
  miactividad;

  slideConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1,
  };

  leccionActiva;
  cursoActivo;
  actividadDiaria;

  constructor(
    private router: Router,
    public alertController: AlertController,
    private auth: AuthService,
    private imageS: ImagesService,
    private share: ShareserviceService,
    private vimeoService: VimeoserviceService,
    private chatS: ChatServiceService,
    private pObjecto: PassObjectService,
    private localN: LocalNotifications,
    private log: LoginService,
    private modelcontroller: ModalController,
  ) { }


  

  ngOnInit() {
    this.imageSelect=new Image();
    this.share.getaactividadesDiaria().subscribe( res => {
      console.log('Actividad Diairia', res);
      this.actividadDiaria = res.data.activity;
     
 
    });

      

    this.share.getleccionActiva().then( res => {
     
      this.leccionActiva = res;
    });

    this.share.getcursoActivo().then( info => {
      console.log(info);
      this.cursoActivo = info;
    });

    this.share.var.subscribe( res => {
      this.auth.gettokenLog().then( dt => {
        this.log.logdataInfData(dt).subscribe( infoUser => {
          console.log(infoUser);
          this.usertk = infoUser;
          this.getMiactividad(this.usertk.id);
        });
        
      });
    });

    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
        this.getMiactividad(this.usertk.id);
      });
    });

    this.videos = this.vimeoService.getVideos(this.user);
    this.albums = this.vimeoService.getAlbums(this.user);
    this.items = this.share.getProducts();
    this.chatS.var.subscribe(chatMsg => {
      console.log(chatMsg);
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
    this.localNotification();
    this.cargarImagenes();
  }

   cargarImagenes(){
    this.imageS.getImages().subscribe(data=>{
      this.images=data;
      let i=0;
      for (const [name, image] of Object.entries(data)){
         if(i==0){
            console.log("Datos ",name, image[0]);
            this.urlP="https://venki.inkdigital.co/"+image[0].url;
            console.log("DatosIma ",this.urlP);
         }
         i=1;
      }
    });
  }

  addToCart(product) {
    this.share.addProduct(product);
  }

  retomarleccion(){
    this.pObjecto.setData(this.cursoActivo);
    this.router.navigate(['/users/entrena/vercurso/']);
  }

  seeMore(id: number, info: any) {
    let dataObj = {
      vidinfo: info
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/home/vermas/']);
  }

  didScroll(e) {

  }

  openChat() {
    this.router.navigate(['/users/chat']);
  }

  localNotification() {
    let titleNotif = 'Mensaje de Venky';
    shuffleArray(this.encourageMsg).forEach((message, index) => {
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


  imageView(imag: any){
    this.modelcontroller.create({
      component: ImgPrevPage,
      componentProps: {
        img: imag
      }
    }).then(model => model.present());
  }

  getMiactividad(userid: any) {
    this.share.getActividadUsuario(userid).subscribe(info => {
      console.log(info);
      this.miactividad = info.data.length;
    });
  }

  diagnosticoRedirect(info, id){
    console.log(info);
    let dataObj = {
      idprofile: info,
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/diagnostico-inicio/']);
  }

  async alertDespuesTiempo2(img: any) {
    this.alert = await this.alertController.create({
      cssClass: 'my-customback',
      header: '',
      buttons: [
        {
          text: '',
          cssClass: 'secondaryClose',
        }
      ],
    });
    await this.alert.present();
  }

  async alertDespuesTiempo(img: any) {
    this.alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '',
      message: `<img src="${img}" alt="g-maps" style="border-radius: 2px">`,
      buttons: ['Adelante'],
    });
    await this.alert.present();
  }

  crearEntrada(){
    this.router.navigate(['/users/social/crear-entrada/']);
  }

  recomedacionesRedirect(id: any){
    let dataObj = {
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/recomendaciones/']);
  }

  opinarSobreActividad(act: any){
    let dataObj = {
      actividad: act
    };
    this.pObjecto.setData(dataObj);
    this.share.varDesafio.next('mostrar desafio');
    this.router.navigate(['/users/social/']);
  }

}

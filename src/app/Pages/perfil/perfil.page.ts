import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { ShareserviceService } from './../../_services/shareservice.service';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { Camera } from '@ionic-native/camera/ngx';
import { ActionSheetController, AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';




@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {


  

  cursos;

  sliderImgOption = {
    zoom: false,
    slidesPerView: 1.5,
    cemteredSlides: true,
    spaceBetween: 20
  };

  miactividad: any;

  trofeosInsig = [
    {
      trofeo: 'completa la leccion 1',
      insignia: 'https://gamepedia.cursecdn.com/pathofexile_gamepedia/3/30/High_Council_Supporter_Badge_inventory_icon.png?version=635f473ec0ce9ac102246cc201840e7c'
    },
    {
      trofeo: 'completa la leccion 2',
      insignia: 'https://gamepedia.cursecdn.com/pathofexile_gamepedia/3/30/High_Council_Supporter_Badge_inventory_icon.png?version=635f473ec0ce9ac102246cc201840e7c'
    },
    {
      trofeo: 'completa la leccion 3',
      insignia: 'https://gamepedia.cursecdn.com/pathofexile_gamepedia/3/30/High_Council_Supporter_Badge_inventory_icon.png?version=635f473ec0ce9ac102246cc201840e7c'
    }
  ];


  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;

  paginaActual: any;
  ultimaPage: any;
  totalDt: any;
  cart = [];
  msj = [];
  usertk = null;
  loading: any;
  alert: any;
  constructor(
    private auth: AuthService,
    private router: Router,
    private share: ShareserviceService,
    public render: Renderer2,
    private chatS: ChatServiceService,
    private camara: Camera,
    private actionSheetcontroller: ActionSheetController,
    private log: LoginService,
    private loadingCtrl: LoadingController,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    ) { }

  ngOnInit() {
    this.cursos = [];
    this.chatS.var.subscribe(chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
    this.cart = this.share.getCart();


    this.share.var.subscribe( res => {
      this.auth.gettokenLog().then( dt => {
        this.log.logdataInfData(dt).subscribe( infoUser => {
          console.log(infoUser);
          this.usertk = infoUser;
          if (this.usertk.photo === null){
            this.usertk.photo = 'https://i.ibb.co/f0Z6QWK/default.jpg';
            this.getcursos(this.usertk.id);
            this.getMiactividad(this.usertk.id);
          }else{
            let pht = 'http://venki.ml/photos/' + this.usertk.photo;
            this.usertk.photo = pht;
            this.getcursos(this.usertk.id);
            this.getMiactividad(this.usertk.id);
          }
        });
      });
    });

    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
        if (this.usertk.photo === null){
          this.usertk.photo = 'https://i.ibb.co/f0Z6QWK/default.jpg';
          this.getcursos(this.usertk.id);
          this.getMiactividad(this.usertk.id);
        }else{
          let pht = 'http://venki.ml/photos/' + this.usertk.photo;
          this.usertk.photo = pht;
          this.getcursos(this.usertk.id);
          this.getMiactividad(this.usertk.id);
        }
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
      encodingType: this.camara.EncodingType.JPEG
    }).then((res) => {
      let imgsend = 'data:image/jpeg;base64,' + res;
      this.share.actualizarPhoto(this.usertk.id, imgsend).subscribe(imageResponse => {
        this.presentLoading();
        setTimeout(() => {
          this.loading.dismiss();
        }, 1700);
        this.share.var.next('updatePhoto');
      });
    }).catch(e => {
      console.log(e);
    });
  }

  usarGaleria() {
    this.camara.getPicture({
      sourceType: this.camara.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camara.DestinationType.DATA_URL,
      mediaType: this.camara.MediaType.PICTURE,
      encodingType: this.camara.EncodingType.JPEG
    }).then((res) => {
      let phtoto = 'data:image/jpeg;base64,' + res;
      this.share.actualizarPhoto(this.usertk.id, phtoto).subscribe(imageResponse => {
        this.presentLoading();
        setTimeout(() => {
          this.loading.dismiss();
        }, 1700);
        this.share.var.next('updatePhoto');
      });
    }).catch(e => {
      console.log(e);
    });
  }

  eliminarCursos(idUser: any, idCurso: any) {
    this.share.deleteCursoUsuario(idUser, idCurso).subscribe(data => {
      this.getcursos(idUser);
    });
  }

  eventchangeTab(e) {
    this.getcursos(this.usertk.id);
  }


  getMiactividad(userid: any) {
    this.share.getActividadUsuario(userid).subscribe(info => {
      console.log(info);
      this.miactividad = info.data;
      this.paginaActual = info.meta.current_page;
      this.ultimaPage = info.meta.last_page;
      this.totalDt = info.meta.total;
    });
  }

  getcursos(userid: any) {
    this.share.getCursosUsuario(userid).subscribe(info => {
      this.cursos = info.data;
    });
  }


  opcionesRedirect() {
    this.router.navigate(['/users/perfil/opciones/']);
  }

  openChat() {
    this.router.navigate(['/users/chat']);
  }

  verMicontenico(info: any) {
    let NavigationExtras: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(info),
      }
    };
    this.router.navigate(['/users/perfil/vercontenido/'], NavigationExtras);
  }

  openCart() {
    this.router.navigateByUrl('/users/cart');
  }
  verCurso(info: any) {
    this.router.navigate(['/users/entrena']);
  }

  abrirDialogo(user: any) {
    this.router.navigate(['/users/perfil/edit-perfil/']);
  }

  miCalendario() {
    this.router.navigate(['/users/perfil/calendario/']);
  }


  misEstadisticas() {
    this.router.navigate(['/users/perfil/estadisticas/']);
  }

  cursosGeneral(info: any) {
    let NavigationExtras: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(info),
      }
    };
    this.router.navigate(['/users/perfil/cursos-general/'], NavigationExtras);
  }

  MisObjetivos(info: any) {
    let NavigationExtras: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(info),
      }
    };
    this.router.navigate(['/users/perfil/mis-objetivos/'], NavigationExtras);
  }


  miTimeLine() {
    this.router.navigate(['/users/perfil/timeline/']);
  }

  diagnosticoRedirect(info, id){
    const img = '../../../assets/imagenesDiagnostico/img1.jpeg';
    this.alertDespuesTiempo(img);
    console.log(info);
    let dataObj = {
      idprofile: info,
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/diagnostico/']);
  }

  async alertDespuesTiempo(img: any) {
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

  recomedacionesRedirect(id: any){
    let dataObj = {
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/recomendaciones/']);
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
          console.log('Respuesta paguina', resPg);
          resPg.data.forEach(element => {
            this.miactividad.push(element);
          });
          event.target.complete();
        });
    }, 2000);
  }

}

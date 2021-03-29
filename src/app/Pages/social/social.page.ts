import { ShareserviceService } from './../../_services/shareservice.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { ImageModalPage } from './image-modal/image-modal.page';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { LoginService } from 'src/app/_services/login.service';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage implements OnInit {

  miactividad: any;

  message_header: string;

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
  elemento: any;

  msj = [];

  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;

  paginaActual: any;
  ultimaPage: any;
  totalDt: any;
  LikeValue: number;
  contadorlike: number;
  idPost: any;
  config: any;

  basePath = `${environment.HOST}`;

  constructor(
    private route: Router,
    private chatS: ChatServiceService,
    private modelcontroller: ModalController,
    private share: ShareserviceService,
    private pObjecto: PassObjectService,
    private log: LoginService,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private loadingService: LoadingService
    ) {
      this.LikeValue = 0;
      this.getCurrentHour();
      this.getPosts();
  }

  ngOnInit() {
    this.chatS.var.subscribe( chatMsg => {
      this.msj = this.chatS.getbadge();
    });

    this.msj = this.chatS.getbadge();
    
    this.share.varPostUpdate.subscribe( res => {
      this.infonitescroll.disabled  = false;
      this.getPosts();
    });

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

  getPosts() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getpost().subscribe( res => {
      // this.miactividad = res.data.sort((a: any,b: any) => 0 - (a > b ? -1 : 1));
      this.miactividad = res.data;
      this.paginaActual = res.meta.current_page;
      this.ultimaPage = res.meta.first_page;
      this.totalDt = res.meta.total;
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando Datos...'
    });
    return this.loading.present();
  }

  handleLike(valor: any, valorid: any){
    this.LikeValue = valor;
    this.contadorlike = valor;
    this.contadorlike = this.contadorlike + 1;
    this.idPost = valorid;
    this.share.actualizarpost(this.idPost, this.contadorlike).subscribe( res => {
      this.share.varPostUpdate.next('update data');
      this.ngOnInit();
    });
  }

  verUser(userdt: any){
    this.pObjecto.setData({userinfo: userdt});
    this.route.navigate(['/users/social/ver-usuario']);
  }

  imageView(imag: any){
    this.modelcontroller.create({
      component: ImageModalPage,
      componentProps: {
        img: imag
      }
    }).then(model => model.present());
  }

  openChat(infouserpost: any){
    const dataObj = {
      infoDt: infouserpost,
      transferID: this.usertk.id,
      useractual: this.usertk.name
    };
    this.pObjecto.setData(dataObj);
    this.route.navigate(['/users/chat/mensaje-busqueda/']);
  }

  crearEntrada(id: number){
    const dataObj = {
      idAction: id
    };
    this.pObjecto.setData(dataObj);
    this.route.navigate(['/users/social/crear-entrada/']);
  }

  loadData(event){
    this.paginaActual = this.paginaActual + 1;
    setTimeout(() => {
        if (this.miactividad.length >= this.totalDt){
          event.target.complete();
          this.infonitescroll.disabled  = true;
          return;
        }
        this.share.getpostNextPage(this.paginaActual).subscribe( resPg => {
          resPg.data.forEach(element => {
            this.miactividad.unshift(element);
          });
          event.target.complete();
        });
    }, 5000);
  }
}


import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { environment } from 'src/environments/environment';
import { ImageModalPage } from '../../social/image-modal/image-modal.page';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.page.html',
  styleUrls: ['./actividad.page.scss'],
})
export class ActividadPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;

  message_header: string;
  token: any;
  user = null;

  activity = [];
  paginaActual: any;
  ultimaPage: any;
  totalDt: any;
  basePath = `${environment.HOST}`;

  sliderImgOption = {
    initialSlide: 0,
    zoom: false,
  };

  constructor(
    private auth: AuthService,
    private log: LoginService,
    private router: Router,
    private loadingService: LoadingService,
    private share: ShareserviceService,
    private modelcontroller: ModalController
  ) { 
    this.getToken();
  }

  ngOnInit() {
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.getAuthUser();
    });
  }

  getAuthUser() {
    this.log.logdataInfData(this.token).subscribe( resp => {
      this.user = resp;
      this.getActivity();
    });
  }

  getActivity() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getActividadUsuario(this.user.id, this.token).subscribe(info => {
      this.activity = info.data;
      this.paginaActual = info.meta.current_page;
      this.ultimaPage = info.meta.last_page;
      this.totalDt = info.meta.total;
        this.loadingService.loadingDismiss();
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  loadData(event) {
    this.paginaActual = this.paginaActual + 1;
    setTimeout(() => {
        if (this.activity.length >= this.totalDt){
          event.target.complete();
          this.infonitescroll.disabled  = true;
          return;
        }
        this.share.getpostNextPage(this.paginaActual, this.token).subscribe( resPg => {
          resPg.data.forEach(element => {
            this.activity.push(element);
          });
          event.target.complete();
        });
    }, 2000);
  }

  imageView(imag: any) {
    const url = this.basePath+"medias/"+imag; 
    this.modelcontroller.create({
      component: ImageModalPage,
      componentProps: {
        img: url,
        type: 1
      }
    }).then(model => model.present());
  }

  volver() {
    this.router.navigate(['/users/perfil']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { environment } from 'src/environments/environment';
import { ImageModalPage } from '../../social/image-modal/image-modal.page';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {

  token: any;
  post: any;
  usertk = null;

  sliderImgOption = {
    initialSlide: 0,
    zoom: false,
  };

  basePath = `${environment.HOST}`;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private auth: AuthService,
    private pObjecto: PassObjectService,
    private log: LoginService,
    private modelcontroller: ModalController
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.getInformation();
  }

  getToken() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.log.logdataInfData(resp).subscribe( user => {
        this.usertk = user;
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  getInformation() {
    const informacion = this.pObjecto.getNavData();
    this.post = informacion.publication;
  }

  imageView(imag: any, type: any) {
    const url = this.basePath+"medias/"+ imag;
    this.modelcontroller.create({
      component: ImageModalPage,
      componentProps: {
        img: url,
        type: type
      }
    }).then(model => model.present());
  }


  back() {
    this.router.navigate(['/users/perfil/competencia']);
  }

}

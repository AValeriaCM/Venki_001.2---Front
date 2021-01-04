import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';

@Component({
  selector: 'app-info-premium',
  templateUrl: './info-premium.page.html',
  styleUrls: ['./info-premium.page.scss'],
})
export class InfoPremiumPage implements OnInit {

  img: any;

  @ViewChild('slider', {read: ElementRef}) slider: ElementRef;

  sliderOpts = {
    zoom: {
      maxRatio: 5
    },
  };

  usertk;
  alert: any;

  constructor(
    private navParams: NavParams,
    private modalCRTL: ModalController,
    private auth: AuthService,
    private log: LoginService,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    private router: Router,
    ) { }

  ngOnInit() {

    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
      });
    });

    this.img = this.navParams.get('img');
  }


  diagnosticoRedirect(info, id){
    let dataObj = {
      idprofile: info,
      idUser: id
    };
    this.modalCRTL.dismiss();
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


  recomedacionesRedirect(id: any){
    let dataObj = {
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.modalCRTL.dismiss();
    this.router.navigate(['/users/perfil/recomendaciones/']);
  }

  zoom(zoomIn: boolean){
    let zoom = this.slider.nativeElement.swiper.zoom;
    console.log(zoom);
    if (zoomIn){
      zoom.in();
    } else {
      zoom.out();
    }
  }

  close(){
    this.router.navigate(['/users/home/']);
    this.modalCRTL.dismiss();
  }

}

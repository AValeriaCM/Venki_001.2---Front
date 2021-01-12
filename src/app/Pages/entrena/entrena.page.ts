import { InfoInicioPage } from './info-inicio/info-inicio.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { AlertController, ModalController } from '@ionic/angular';
import { InfoPremiumPage } from './info-premium/info-premium.page';
import { LoginService } from 'src/app/_services/login.service';


@Component({
  selector: 'app-entrena',
  templateUrl: './entrena.page.html',
  styleUrls: ['./entrena.page.scss'],
})
export class EntrenaPage implements OnInit {

  colores=['#175fa2','#581845','#283747','#FF5733','#943126', '#64797f', '#191f63']
  autoClose = true;
  progesoVal;
  usertk = null;
  cursosCargados: any[] = [];
  cursos: any[] = [];
  cursosUser: any[] = [];
  msj = [];
  alert: any;
  sliderImgOption = {
    zoom: false,
    slidesPerView: 1,
    cemteredSlides: true,
    spaceBetween: 20
  };


  constructor(
    private router: Router,
    private share: ShareserviceService,
    private auth: AuthService,
    private previewAnyFile: PreviewAnyFile,
    private streaminmedia: StreamingMedia,
    private chatS: ChatServiceService,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    private modelcontroller: ModalController,
    private log: LoginService,) { }

  ngOnInit() {
    this.auth.gettokenLog().then(dt => {
      this.log.logdataInfData(dt).subscribe(infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
          this.modelcontroller.create({
            component: InfoInicioPage,
          }).then(model => model.present());
      });
    });

    this.chatS.var.subscribe(chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
    this.auth.getUserData().then(dt => {
      this.usertk = dt;
      this.getcursos(this.usertk.id);
    });
  }

  async alertDespuesTiempoimg1() {
    this.alert = await this.alertController.create({
      cssClass: 'my-custombackentrena',
      header: '',
      message: 'El estado de bienestar en el cual el individuo es consciente de sus propias capacidades, puede afrontar las tensiones normales los aspectos cotidianos de la vida o de los espacios donde se desenvuelve en una actividad, puede tener una respuesta de forma productiva y fructífera y es capaz de hacer una contribución a su comunidad o al contexto donde se desenvuelva.' +
      'Desde otra mirada, la salud mental es vista como la capacidad de amar, de trabajar y de jugar.La capacidad de amar se refiere a la posibilidad de poder construir relaciones auténticas e íntimas con otras personas, donde se puede dar y recibir afecto.La capacidad de trabajar se refiere a la posibilidad de sentirse productivo, de sentir que lo que uno hace tiene sentido, de tener un cierto orgullo en las tareas que desempeña.',
      buttons: [
        {
          text: 'Cerrar',
          cssClass: 'secondaryCloseEntra',
        }
      ],
    });
    await this.alert.present();
  }


  getcursos(userid: any) {
    this.share.getCategorias().subscribe(info => {
      this.cursos = info.data;
      this.cursosCargados=this.cursos;
      console.log(this.cursos);
    });
  }

  openChat() {
    this.router.navigate(['/users/chat']);
  }

  verCurso(info: any, desc: any, color:any) {
    console.log(info);
    let dataObj = {
      infoCurso: info,
      userInf: this.usertk,
      color:color,
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/entrena/cursos-categorias/']);
  }


  imageView() {
    console.log('entre en model dismiss');
    this.modelcontroller.create({
      component: InfoPremiumPage,
    }).then(model => model.present());
  }


  async alertDespuesTiempo() {
    this.alert = await this.alertController.create({
      header: 'UPS!',
      subHeader:
        'Ya tienes ese curso agregado prueba con otro',
      message:
        'No puedes agregar varias veces un mismo curso',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }


  async alertDespuesTiempoDescripcion(decrip: any) {
    this.alert = await this.alertController.create({
      cssClass: 'my-custombackentrena',
      header: '',
      message: decrip,
      buttons: ['Continuar'],
    });
    await this.alert.present();
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.cursos = this.cursosCargados.filter((item) => {
      return (item.name.indexOf(filtro) > -1);
    });
  }  
}

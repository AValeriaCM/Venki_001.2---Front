import { InfoInicioPage } from './info-inicio/info-inicio.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { AlertController, ModalController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entrena',
  templateUrl: './entrena.page.html',
  styleUrls: ['./entrena.page.scss'],
})
export class EntrenaPage implements OnInit {

  colores=['#175fa2','#581845','#283747','#FF5733','#943126', '#64797f', '#191f63']
  autoClose = true;
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

  message_header: string;
  basePath = `${environment.HOST}`;
  token: any;

  constructor(
    private router: Router,
    private share: ShareserviceService,
    private auth: AuthService,
    private chatS: ChatServiceService,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    private modelcontroller: ModalController,
    private log: LoginService,
    private loadingService: LoadingService 
    ) { 
      this.getToken();
  }

  ngOnInit() {
  }

  loadPage() {
    this.getCurrentHour();
    this.getAuthUser();
    this.chatS.var.subscribe(chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
    this.auth.getUserData().then(dt => {
      this.usertk = dt;
      this.getcursos();
    });
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.loadPage();
    });
  }

  getAuthUser() {
    this.auth.gettokenLog().then(dt => {
      this.log.logdataInfData(dt).subscribe(infoUser => {
        this.usertk = infoUser;
         this.modelcontroller.create({
            component: InfoInicioPage,
          }).then(model => model.present());
      });
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

  getcursos() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCategorias(this.token).subscribe(info => {
      this.cursos = info.data.reverse();
      this.cursosCargados = info.data;
      this.loadingService.loadingDismiss();
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  verCurso(info: any, desc: any, color:any) {
    let dataObj = {
      infoCurso: info,
      userInf: this.usertk,
      color:color,
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/entrena/cursos-categorias']);
  }

}

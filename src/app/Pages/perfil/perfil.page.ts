import { RegistroService } from './../../_services/registro.service';
import { Registro } from './../../_model/Registro';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShareserviceService } from './../../_services/shareservice.service';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { PopoverController } from '@ionic/angular';  
import { AvatarPage } from '../popup/avatar/avatar.page';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;
  
  sliderImgOption = {
    initialSlide: 0,
    zoom: false,
  };

  trofeosInsig = [];

  paginaActual: any;
  ultimaPage: any;
  totalDt: any;
  cart = [];
  msj = [];
  usertk = null;
  loading: any;
  alert: any;
  items = [
    {
      situacion: 'Soltero'
    },
    {
      situacion: 'Casado'
    }
  ];
  
  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
  nombrePattern: any = /^[A-Za-z -]+$/;
  contrasenaPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  adressPattern: any = /^[#.0-9a-zA-Z\s,-]+$/;
  phonePatten: any = /^[ +0-9 +]+$/;
  editarForm: FormGroup;
  isSubmitted = false;
  editarUser: Registro;
  message_header: string;
  basePath = `${environment.HOST}`;
  coursesProgress = [];
  coursesCompleted = [];
  token: any;

  profileUser = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private share: ShareserviceService,
    public render: Renderer2,
    private chatS: ChatServiceService,
    private log: LoginService,
    private loadingCtrl: LoadingController,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    private popover:PopoverController,
    private edit: RegistroService ,
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.getCurrentHour();
    this.chatS.var.subscribe(chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
    this.cart = this.share.getCart();
    this.getAuthUser();
  }

  async showLoader() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando Datos...'
    });
    return this.loading.present();
  }

  dismissLoader() {
    this.loading.dismiss();
  }

  async presentAlert(title, message) {
    let alert = await this.alertController.create({
      header: title,
      subHeader: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
    });
  }

  getAuthUser() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        this.profileUser = this.usertk.profile.name
        this.inicializarFormulario(this.usertk);  
        if (this.usertk.photo === null){
          this.usertk.photo = 'https://i.ibb.co/f0Z6QWK/default.jpg';
          this.getcursos(this.usertk.id);
        }else{
          let pht = this.basePath + 'photos/' + this.usertk.photo;
          this.usertk.photo = pht;
          this.getcursos(this.usertk.id);
        }
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

  CreatePopover()
  {
    const that = this;
    this.popover.create({component:AvatarPage, showBackdrop:false}).then((popoverElement)=>{
      popoverElement.present();
      popoverElement.onDidDismiss().then(data => {
        that.refreshAvatar();
      });
    })
  }

  refreshAvatar() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
      });
    });
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando Datos...'
    });
    return this.loading.present();
  }

  eventchangeTab(e) {
    this.getcursos(this.usertk.id);
  }

  getcursos(userid: any) {
    this.share.getCursosUsuario(userid, this.token).subscribe(info => {
      this.coursesProgress = info.data.filter( (course: any) => course.pivot.progress != 1 );
      this.coursesCompleted = info.data.filter( (course: any) => course.pivot.progress == 1 );
    });
  }

  verCurso() {
    this.router.navigate(['/users/entrena']);
  }

  abrirDialogo() {
    this.router.navigate(['/users/perfil/edit-perfil']);
  }

  miCalendario() {
    this.router.navigate(['/users/perfil/calendario']);
  }

  misEstadisticas() {
    this.router.navigate(['/users/perfil/estadisticas']);
  }

  MisObjetivos(info: any) {
    let NavigationExtras: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(info),
      }
    };
    this.router.navigate(['/users/perfil/mis-objetivos'], NavigationExtras);
  }

  miTimeLine() {
    this.router.navigate(['/users/perfil/timeline']);
  }

  diagnosticoRedirect(info, id){
    let dataObj = {
      idprofile: info,
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/diagnostico-inicio']);
  }

  recomedacionesRedirect(id: any) {
    let dataObj = {
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/recomendaciones']);
  }

  activityRedirect() {
    this.router.navigate(['/users/perfil/actividad']);
  }

  /*
  * form-edit
  */
  inicializarFormulario(dt: any) {
    this.editarForm = new FormGroup({
      name : new FormControl(dt.name,
      [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
      lastname : new FormControl(dt.lastname,
      [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
      birthday : new FormControl(dt.birthday, [Validators.required]),
      email : new FormControl(dt.email,
      [Validators.required, Validators.min(7) , Validators.max(70), Validators.pattern(this.emailPattern)]),
      phone : new FormControl(dt.phone,
      [Validators.required, Validators.minLength(8) , Validators.maxLength(22), Validators.pattern(this.phonePatten)]),
      description : new FormControl(dt.description,
      [Validators.required]),
      institution : new FormControl(dt.institution,
        [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
      city : new FormControl(dt.city,
          [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
      status : new FormControl(dt.status,[Validators.required]),
    });
  }

  editar(){
    this.editarUser = this.editarForm.value;
    this.edit.Editartodo(this.editarUser, this.usertk.id, this.editarForm.value.status, this.token).subscribe( response => {
      this.auth.updateToken();
      this.share.var.next('data update');
      this.router.navigateByUrl('/users/home');
    });
  }

  createCompetition(id: number) {
    const dataObj = {
      idAction: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/competencia']);
  }

  logout(){
    this.auth.logout();
  }
}

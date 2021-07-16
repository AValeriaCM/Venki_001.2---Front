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
import { ImagesService } from 'src/app/_services/images.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { TerminosNinosPage } from '../terminos-ninos/terminos-ninos.page';

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

  sexs = [
    {
      sex: 'Masculino'
    },
    {
      sex: 'Femenino'
    },
    {
      sex: 'Prefiero no decirlo'
    }
  ];

  orientationsFeet = [
    {
      orientation: 'Derecho'
    },
    {
      orientation: 'Izquierdo'
    }
  ];

  orientationsHands = [
    {
      orientation: 'Derecha'
    },
    {
      orientation: 'Izquierda'
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

  imageSports = null;
  imageAcademic = null;

  profileUser = null;

  year = (new Date()).getFullYear();

  edad = 18;

  ischeckNino = [
    {
      selected: false
    }
  ];

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
    private edit: RegistroService,
    private images: ImagesService,
    private loadingService: LoadingService,
    private pop:PopoverController
  ) { 
    this.getAuthUser();
    this.getToken();
    this.refreshProfile();
    this.refrescarMetricas();
  }

  ngOnInit() {
    this.getCurrentHour();
    this.chatS.var.subscribe(chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
    this.cart = this.share.getCart();
  }

  obtenerTrofeos() {
    this.share.consultarResultados(this.token, this.usertk.id).subscribe(resp => {
      this.trofeosInsig = resp.data;
    }, error => {})
  }

  refreshProfile() {
    this.share.varProfile.subscribe( res => {
      if(res) {
        this.profileUser = res.name;
        this.usertk.profile.id = res.id;
        this.usertk.surveyed = 0;
      }
    });
  }
  
  refrescarMetricas() {
    this.share.varMetricas.subscribe( res => {
      if(res) {
        this.usertk.surveyed = 1;
      }
    });
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

  getImages() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.images.getImages(this.token).subscribe( (resp: any) => {
      this.imageSports = resp.data.find( (image: any) => image.type === 1);
      this.imageAcademic = resp.data.find( (image: any) => image.type === 0);
      this.loadingService.loadingDismiss();
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  getAuthUser() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        this.profileUser = this.usertk.profile.name;
        this.obtenerTrofeos();
        this.getImages();
        this.inicializarFormulario(this.usertk);  
        if (this.usertk.photo === null) {
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
      info.data.map( (resp: any) => {
        this.share.obtenerLeccionesUsuario(resp.id, this.token, userid).subscribe( respuesta => {
          respuesta.data.map( (leccion: any) => {
            const find = resp.lessons.find( (o: any) => o.id === leccion.id_lesson && o.course_id === leccion.id_course );
            if(find) {
              find.status = 1
            }
          });
          const totalLecciones = resp.lessons.length;
          const totalHechas = resp.lessons.filter( (o: any) => o.status === 1 ).length;
          if( totalLecciones > 0 ) {
            resp.progreso = totalHechas/totalLecciones;
          }
          this.loadingService.loadingDismiss();
        }, error => {
          this.loadingService.loadingDismiss();
        });
      });

      this.coursesCompleted = info.data;
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

  diagnosticoRedirect(info: any, id: any) {
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

  categoryRedirect() {
    this.router.navigate(['/users/perfil/categoria']);
  }

  /*
  * form-edit
  */
  inicializarFormulario(dt: any) {
    this.editarForm = new FormGroup({
      name : new FormControl(dt.name, [Validators.pattern(this.nombrePattern)]),
      lastname : new FormControl(dt.lastname, [Validators.pattern(this.nombrePattern)]),
      birthday : new FormControl(dt.birthday),
      email : new FormControl(dt.email, [Validators.required, Validators.min(7) , Validators.max(70), Validators.pattern(this.emailPattern)]),
      phone : new FormControl(dt.phone, [Validators.pattern(this.phonePatten)]),
      description : new FormControl(dt.description),
      institution : new FormControl(dt.institution, [Validators.pattern(this.nombrePattern)]),
      city : new FormControl(dt.city, [Validators.pattern(this.nombrePattern)]),
      status : new FormControl(dt.status),
      sex : new FormControl(dt.sex === 'null' ? '' : dt.sex),
      placeOfBirth : new FormControl(dt.placeOfBirth === 'null' ? '' : dt.placeOfBirth),
      height : new FormControl(dt.height === 'null' ? '' : dt.height),
      weight : new FormControl(dt.weight === 'null' ? '' : dt.weight),
      dominantFoot: new FormControl(dt.dominantFoot === 'null' ? '' : dt.dominantFoot),
      dominantHand: new FormControl(dt.dominantHand === 'null' ? '' : dt.dominantHand),
      graduationYear: new FormControl(dt.graduationYear === 'null' ? '' : dt.graduationYear),
      highSchoolAverage: new FormControl(dt.highSchoolAverage === 'null' ? '' : dt.highSchoolAverage),
      gpa: new FormControl(dt.gpa === 'null' ? '' : dt.gpa),
      sat: new FormControl(dt.sat === 'null' ? '' : dt.sat),
      toefl: new FormControl(dt.toefl === 'null' ? '' : dt.toefl),
      mainSport: new FormControl(dt.mainSport === 'null' ? '' : dt.mainSport),
      playingPosition: new FormControl(dt.playingPosition === 'null' ? '' : dt.playingPosition),
      events: new FormControl(dt.events === 'null' ? '' : dt.events),
      time: new FormControl(dt.time === 'null' ? '' : dt.time),
      records: new FormControl(dt.records === 'null' ? '' : dt.records),
      route: new FormControl(dt.route === 'null' ? '' : dt.route),
      rankings: new FormControl(dt.rankings === 'null' ? '' : dt.rankings),
      recognitions: new FormControl(dt.recognitions === 'null' ? '' : dt.recognitions),
      press: new FormControl(dt.press === 'null' ? '' : dt.press),
      differences: new FormControl(dt.differences === 'null' ? '' : dt.differences),
      competencies: new FormControl(dt.competencies === 'null' ? '' : dt.competencies),
      goals: new FormControl(dt.goals === 'null' ? '' : dt.goals)
    });
  }

  cambioFecha($event){
    const convertAge = new Date($event);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  }

  terminosMostrarNinos()
  {
    this.pop.create({component:TerminosNinosPage,
    showBackdrop:false}).then((popoverElement)=>{
      popoverElement.present();
    })
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

  logout() {
    this.auth.logout();
  }
}

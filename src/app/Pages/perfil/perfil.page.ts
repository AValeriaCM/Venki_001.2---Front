import { RegistroService } from './../../_services/registro.service';
import { Registro } from './../../_model/Registro';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShareserviceService } from './../../_services/shareservice.service';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { PopoverController } from '@ionic/angular';  
import { AvatarPage } from '../popup/avatar/avatar.page';
import { LoadingService } from 'src/app/_services/loading.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infonitescroll: IonInfiniteScroll;

  sliderImgOption = {
    zoom: false,
    slidesPerView: 1.5,
    cemteredSlides: true,
    spaceBetween: 20
  };

  miactividad: any;

  trofeosInsig = [];

  paginaActual: any;
  ultimaPage: any;
  totalDt: any;
  cart = [];
  msj = [];
  usertk = null;
  loading: any;
  alert: any;
  //var from edit
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
  situacionS = null;

  message_header: string;
  basePath = `${environment.HOST}`;
  coursesProgress = [];
  coursesCompleted = [];

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
    private loadingService: LoadingService 
  ) { }

  ngOnInit() {

    this.getCurrentHour();
    this.chatS.var.subscribe(chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
    this.cart = this.share.getCart();
    this.getAuthUser();
  }

  getAuthUser() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        this.inicializarFormulario(this.usertk);  
        if (this.usertk.photo === null){
          this.usertk.photo = 'https://i.ibb.co/f0Z6QWK/default.jpg';
          this.getcursos(this.usertk.id);
          this.getMiactividad(this.usertk.id);
        }else{
          let pht = this.basePath + 'photos/' + this.usertk.photo;
          this.usertk.photo = pht;
          this.getcursos(this.usertk.id);
          this.getMiactividad(this.usertk.id);
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
    this.popover.create({component:AvatarPage,
    showBackdrop:false}).then((popoverElement)=>{
      popoverElement.present();
    })
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

  getMiactividad(userid: any) {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getActividadUsuario(userid).subscribe(info => {
      this.miactividad = info.data;
      this.paginaActual = info.meta.current_page;
      this.ultimaPage = info.meta.last_page;
      this.totalDt = info.meta.total;
        this.loadingService.loadingDismiss();
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  getcursos(userid: any) {
    this.share.getCursosUsuario(userid).subscribe(info => {
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

  recomedacionesRedirect(id: any){
    let dataObj = {
      idUser: id
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/perfil/recomendaciones']);
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
            this.miactividad.push(element);
          });
          event.target.complete();
        });
    }, 2000);
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
    });
  }

  editar(){
    this.editarUser = this.editarForm.value;
    this.edit.Editartodo(this.editarUser, this.usertk.id, this.situacionS).subscribe( response => {
      this.auth.updateToken();
      this.share.var.next('data update');
      this.router.navigateByUrl('/users/home');
    });
  }

  optionsFn(it: any){
    this.situacionS = it.situacion;
  }

  logout(){
    this.auth.logout();
  }
}

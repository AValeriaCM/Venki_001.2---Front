import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { AlertController, PopoverController, Platform } from '@ionic/angular';
import { RegistroService } from './../../_services/registro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registro } from './../../_model/Registro';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format } from 'date-fns';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { TerminosNinosPage } from '../terminos-ninos/terminos-ninos.page';
import { LoadingService } from 'src/app/_services/loading.service';
import { AngularFireAuth } from '@angular/fire/auth';
import  auth  from 'firebase/app';
import firebase from 'firebase/app';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';

declare let cordova: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  /**
   * Variables
   */
  picture;
  email;
  name;
  // ----------Pattern-----------

  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
  nombrePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1])[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
  contrasenaPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  adressPattern: any = /^[#.0-9a-zA-Z\s,-]+$/;
  phonePatten: any = /^[ +0-9 +]+$/;
  // ----------Pattern-----------

  edad: number= 18;
  regisform: FormGroup;
  isSubmitted = false;
  nUsuario: Registro;
  RespuesTerminos: boolean;
  showpassword = false;
  passwordToggleIcon = 'eye';
  showpasswordConfirm = false;
  passwordToggleIconConfirm = 'eye';
  ischeck = [
    {
      selected: false
    }
  ];
  termSelect = false;

  ischeckNino = [
    {
      selected: false
    }
  ];
  termSelectNino = false;
  basePath = `${environment.HOST}`;

  year = (new Date()).getFullYear();

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private registro: RegistroService,
    public alertController: AlertController,
    private previewAnyFile: PreviewAnyFile,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private fb: Facebook,
    private pop:PopoverController,
    private loadingService: LoadingService,
    private AFauth: AngularFireAuth,
    private fileOpener: FileOpener,
    private diagnostic: Diagnostic,
    private transfer: FileTransfer
    ) {
      console.log('now', this.year);
    }

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.regisform = new FormGroup({
      name: new FormControl('',
        [Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern(this.nombrePattern)]),
      lastname: new FormControl('',
        [Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern(this.nombrePattern)]),
      birthday: new FormControl('', [Validators.required]),
      email: new FormControl('',
        [Validators.required, Validators.minLength(7), Validators.maxLength(70), Validators.pattern(this.emailPattern)]),
      phone: new FormControl('',
        [Validators.required, Validators.pattern(this.phonePatten)]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(this.contrasenaPattern)]),
      password_confirmation: new FormControl('', [Validators.required]),
    },
      { validators: this.matchingPasswords('password', 'password_confirmation') });
  }

  matchingPasswords(password: string, passwordconfirmation: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const passwordT = group.controls[password];
      const confirmPassword = group.controls[passwordconfirmation];

      if (passwordT.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  showpass(): void {
    this.showpassword = !this.showpassword;

    if (this.passwordToggleIcon === 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  showpassConfirm(): void {
    this.showpasswordConfirm = !this.showpasswordConfirm;

    if (this.passwordToggleIconConfirm === 'eye') {
      this.passwordToggleIconConfirm = 'eye-off';
    } else {
      this.passwordToggleIconConfirm = 'eye';
    }
  }

  checkval(check) {
    this.termSelect = check.selected;
  }

  checkvalNinos(checkNino) {
    this.termSelectNino = checkNino.selected;
  }

  leerterminos() {
    var url = 'http://api.vigiaelectronic.com.co/tratamiento_de_datos.pdf';
    this.previewAnyFile.preview(url).then(() => {
    }, (err) => {
    });
  }

  Registrarce() {
    this.isSubmitted = true;
    if (this.termSelect === false) {
      this.mesnajeAlert();
    } else {
        this.nUsuario = this.regisform.value;
        const bt = format(new Date(this.nUsuario.birthday), 'yyyy-MM-dd');
        this.nUsuario.birthday = bt;
        this.nUsuario.register_social = false;
        this.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
        this.registro.registro(this.nUsuario).subscribe(() => {
            this.loadingService.loadingDismiss();
            this.mostrarmensaje('Registro satisfactorio, hemos enviado un correo electrónico de verificación a la dirección registrada', 'OK', 'green-snackbar');
            this.inicializarFormulario();
            this.volverLogin();
        }, error => {
          this.loadingService.loadingDismiss();
        });
    }
  }

  volverLogin(){
    this.router.navigateByUrl('/');
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }

  terminosMostrar()
  {
    const url = this.basePath+'resources/terminosmagin.pdf';
    this.diagnostic.requestExternalStorageAuthorization().then(e =>{
      const fileTransfer: FileTransferObject = this.transfer.create();  
          fileTransfer.download(url,  cordova.file.externalDataDirectory + "TERMINOS_Y_CONDICIONES_MAGIN.pdf").then((entry) => {
            this.fileOpener.open(entry.toURL(), 'application/pdf')
            .then(() => false)
            .catch(e => this.mostrarmensaje('Error descargando el archivo', 'Error', 'red-snackbar'));
          }, (error) => {
            this.mostrarmensaje('Error descargando el archivo', 'Error', 'red-snackbar')              
          });
    }).catch(e => {
      this.mostrarmensaje('Error descargando el archivo', 'Error', 'red-snackbar')        
    })
  }

  terminosMostrarNinos()
  {
    this.pop.create({component:TerminosNinosPage,
    showBackdrop:false}).then((popoverElement)=>{
      popoverElement.present();
    })
  }


  async mesnajeAlert() {
    const alert = await this.alertController.create({
      header: 'Ups!',
      subHeader: 'No puedes registrarte',
      message: 'No te puedes registrar si no aceptas los terminos y condicones de uso',
      buttons: ['Acepto']
    });

    await alert.present();
  }

  cambioFecha($event){
    const convertAge = new Date($event);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  }

/**
 * Metodo de login con google
 */

loginGoogle() {
  if (this.platform.is('android')) {
    this.loginGoogleAndroid();
  } else {
    this.loginGoogleWeb();
  }
}
/**
 * Metodo login google para Android
 */
async loginGoogleAndroid() {
  const that = this;
  that.nUsuario = new Registro();
  const res = await this.googlePlus.login({
    'webClientId': "672643384150-iurrhs1cu5ae2k4kllmck9bd5gtd73jq.apps.googleusercontent.com",
    'offline': true
  }).then( res => {
    if(res.email) {
      that.nUsuario.name = res.givenName;
      that.nUsuario.lastname = res.familyName;
      that.nUsuario.email = res.email;
      that.nUsuario.register_social = true;
      that.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
      that.registro.registro(that.nUsuario).subscribe(() => {
          that.loadingService.loadingDismiss();
          that.mostrarmensaje('Registro satisfactorio, hemos enviado un correo electrónico de verificación a la dirección registrada', 'OK', 'green-snackbar');
          that.inicializarFormulario();
          that.volverLogin();
      }, error => {
        that.loadingService.loadingDismiss();
      });
    } else {
      that.mostrarmensaje('Es necesario un correo electronico para realizar el registro', 'Error', 'red-snackbar');        
    }
  })
  .catch( err => {
    this.mostrarmensaje('Error en el registro', 'Error', 'red-snackbar')        
  }); 
}

/**
 * Metodo login google para Web
 */
async loginGoogleWeb() {
  const that = this;
  that.nUsuario = new Registro();
  const res = await this.AFauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  const user = res.user;
  that.nUsuario.name = user.displayName;
  that.nUsuario.lastname = user.displayName;
  that.nUsuario.email = user.email;
  that.nUsuario.register_social = true;
  that.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
  that.registro.registro(that.nUsuario).subscribe(() => {
      that.loadingService.loadingDismiss();
      that.mostrarmensaje('Registro satisfactorio, hemos enviado un correo electrónico de verificación a la dirección registrada', 'OK', 'green-snackbar');
      that.inicializarFormulario();
      that.volverLogin();
  }, error => {
    that.loadingService.loadingDismiss();
  });

}
  loginWhitFacebook() {
    const that = this;
    that.nUsuario = new Registro();
    return this.fb.login(['public_profile', 'email'])
      .then( (res: FacebookLoginResponse) => {
        let params = new Array<string>();
        this.fb.api('/me?fields=id,email,name,first_name,last_name,gender,birthday', params).then(resp => {
          if(resp.email) {
            that.nUsuario.name = resp.first_name;
            that.nUsuario.lastname = resp.last_name;
            that.nUsuario.email = resp.email;
            that.nUsuario.register_social = true;
            that.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
            that.registro.registro(that.nUsuario).subscribe(() => {
                that.loadingService.loadingDismiss();
                that.mostrarmensaje('Registro satisfactorio, hemos enviado un correo electrónico de verificación a la dirección registrada', 'OK', 'green-snackbar');
                that.inicializarFormulario();
                that.volverLogin();
            }, error => {
              that.loadingService.loadingDismiss();
            });        
          } else {
            that.mostrarmensaje('Es necesario un correo electronico para realizar el registro', 'Error', 'red-snackbar');        
          }
        }).catch( error => {
          that.mostrarmensaje('Error en el registro', 'Error', 'red-snackbar');        
        }); 
        const credential_fb = auth.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return this.AFauth.signInWithCredential(credential_fb);
      }).catch( e =>  {
        that.mostrarmensaje('Error en el registro', 'Error', 'red-snackbar')        
      });
  }
}

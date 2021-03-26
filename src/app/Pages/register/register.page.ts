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
import { CondicionesPage } from '../condiciones/condiciones.page';
import { TerminosNinosPage } from '../terminos-ninos/terminos-ninos.page';
import { LoadingService } from 'src/app/_services/loading.service';

import { AngularFireAuth } from '@angular/fire/auth';
import  auth  from 'firebase/app';
import firebase from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment';


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
  contrasenaPattern: any = /(?=.\d)(?=.[a-z])(?=.*[A-Z]).{8,}/;
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
    private AFauth: AngularFireAuth
    ) {
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
        this.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
        this.registro.registro(this.nUsuario).subscribe(() => {
            this.loadingService.loadingDismiss();
            this.mostrarmensaje('Registro satisfactorio, hemos enviado un correo electrónico de verificación a la dirección registrada', 'OK');
            this.inicializarFormulario();
            this.volverLogin();
        }, error => {
          console.log('error');
          this.loadingService.loadingDismiss();
        });
    }
  }

  volverLogin(){
    this.router.navigateByUrl('/');
  }

  mostrarmensaje(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 5000,
      panelClass: ['green-snackbar'],
    });
  }

  terminosMostrar()
  {
    this.pop.create({component:CondicionesPage,
    showBackdrop:false}).then((popoverElement)=>{
      popoverElement.present();
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
  const res = await this.googlePlus.login({
    'webClientId': "1055244002105-dnqjjrtmq6is8ctf683ffv2q8ihd0l3o.apps.googleusercontent.com",
    'offline': true
  });
  const resConfirmed = await this.AFauth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
  const user = resConfirmed.user;
  this.picture = user.photoURL;
  this.name = user.displayName;
  this.email = user.email;
}

/**
 * Metodo login google para Web
 */
async loginGoogleWeb() {
  const res = await this.AFauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  const user = res.user;
  console.log(user.displayName, user.email);
  this.picture = user.photoURL;
  this.name = user.displayName;
  this.email = user.email;
}

  // servicio de logueo de facebook
 loginWhitFacebook(){
  return this.fb.login(['public_profile', 'email'])
   .then((res: FacebookLoginResponse) =>{ 
     console.log('data', res);
     const credential_fb = auth.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    return this.AFauth.signInWithCredential(credential_fb);
   })
 }
}
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { AuthService } from './../../_services/auth.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { RegistroService } from './../../_services/registro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registro } from './../../_model/Registro';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format } from 'date-fns';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { CondicionesPage } from '../terminos/condiciones/condiciones.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


 

  // ----------Pattern-----------

  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
  nombrePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
  contrasenaPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  adressPattern: any = /^[#.0-9a-zA-Z\s,-]+$/;
  phonePatten: any = /^[ +0-9 +]+$/;
  // ----------Pattern-----------


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

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private registro: RegistroService,
    public alertController: AlertController,
    private auth: AuthService,
    private previewAnyFile: PreviewAnyFile,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private pop:PopoverController) {
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

  leerterminos() {
    var url = 'http://api.vigiaelectronic.com.co/tratamiento_de_datos.pdf';
    this.previewAnyFile.preview(url).then(() => {

    }, (err) => {
      console.log(JSON.stringify(err));
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
      console.log(this.nUsuario.phone);
      this.auth.setPrimeraVez();
      this.registro.registro(this.nUsuario).subscribe(() => {
        this.mostrarmensaje('Registro Satisfactorio', 'Sucess');
        this.inicializarFormulario();
        this.router.navigateByUrl('/');
      });
    }
  }

  volverLogin(){
    this.router.navigateByUrl('/');
  }

  mostrarmensaje(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  terminosMostrar()
  {
    this.pop.create({component:CondicionesPage,
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

  hasError(e){
    console.log(e);
  }
  getNumber(e){
    console.log(e);
  }
  telInputObject(e){
    console.log(e);
  }
  onCountryChange(e){
    console.log(e);
  }

  loginGoogle(){
    this.googlePlus.login({}).then( res => console.log('respuesta: ', res)).catch( err  => console.log('error: ',err));
  }

  loginFacebook(){
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
    .catch(e => console.log('Error logging into Facebook', e));


    this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

}

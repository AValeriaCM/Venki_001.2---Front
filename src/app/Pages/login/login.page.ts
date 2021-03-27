import { UsuariosF } from './../../_model/_Usuario';
import { Login } from './../../_model/Login';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../_services/login.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // ----------Pattern-----------

  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
  contrasenaPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  // ----------Pattern-----------

  loginForm: FormGroup;
  isSubmitted = false;
  loginData: Login;
  responseData: any;
  Data: UsuariosF;
  showpassword = false;
  passwordToggleIcon = 'eye';
  splash = true;
  token: string;

  constructor(
    private route: Router,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private log: LoginService,
    private loadingService: LoadingService
  ) {

    this.auth.gettokenLog().then(tkInf => {
      if (tkInf !== null) {
        this.log.logdataInfData(tkInf).subscribe(resTk => {
          this.auth.gettokenDevice().then(DeviceTk => {
            if (DeviceTk !== null) {
              this.log.saveDevice(resTk.id, DeviceTk);
            }
          });
          if (resTk.profile_id == null) {
            this.route.navigateByUrl('/slides');
          } else {
            this.route.navigateByUrl('/users/home');
          }
        });
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.splash = false;
    }, 5000);
    this.inicializarFormulario();
  }


  inicializarFormulario() {
    this.loginForm = new FormGroup({
      correo: new FormControl('',
        [Validators.required, Validators.minLength(10), Validators.maxLength(70), Validators.pattern(this.emailPattern)]),
      contrasena: new FormControl('',
        [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(this.contrasenaPattern)]),
    });
  }

  showpass(): void {
    this.showpassword = !this.showpassword;
    if (this.passwordToggleIcon === 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  login() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      this.mostrarmensaje('Los datos ingresados no son validos', 'Error', 'red-snackbar');
      return false;
    } else {
      this.loginData = this.loginForm.value;
      this.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
      this.auth.login(this.loginData.correo, this.loginData.contrasena).subscribe(async res => {
        if (res) {
          this.log.logdataInfData(res).subscribe(resTk => {
            this.token = resTk.confirmation_code;
            this.loadingService.loadingDismiss();
            if (this.token == null) {
              this.auth.gettokenDevice().then(DeviceTk => {
                this.log.saveDevice(resTk.id, DeviceTk);
              });
              this.inicializarFormulario();
              if(resTk.profile_id === null) {
                this.route.navigateByUrl('/slides');
              } else{ 
                this.route.navigateByUrl('/users/home');
              }
            } else {
              this.auth.settokenLog(null);
              this.mostrarmensaje('Verifique su correo', 'Error', 'red-snackbar');
            }
          }, error => {
            this.loadingService.loadingDismiss();
          });
        } else {
          this.loadingService.loadingDismiss();
          this.mostrarmensaje('Ah ocurrido un error Intente más tarde o revise sus credenciales', 'Error', 'red-snackbar');
        }
      });
      this.inicializarFormulario();
    }
  }

  registro() {
    this.route.navigateByUrl('/register');
  }

  olvidoc() {
    this.route.navigateByUrl('/olvidoc');
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}

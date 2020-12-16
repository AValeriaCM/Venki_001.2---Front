import { UsuariosF } from './../../_model/_Usuario';
import { Login } from './../../_model/Login';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../_services/login.service';





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
    private log: LoginService
  ) {
    this.auth.gettokenLog().then(tkInf => {
      console.log(tkInf);
      if (tkInf !== null) {
        this.log.logdataInfData(tkInf).subscribe(resTk => {
          this.auth.gettokenDevice().then(DeviceTk => {
            if (DeviceTk !== null) {
              this.log.saveDevice(resTk.id, DeviceTk).subscribe(deviceUpdate => {
                console.log(deviceUpdate);
              });
            }
          });
          if (resTk) {
            this.route.navigateByUrl('/users/home');
          } else {
            console.log('falle');
          }
        });
      } else {
        console.log('falle');
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
      this.mostrarmensaje('Los Datos Ingresados no son validos', 'Error');
      return false;
    } else {
      this.loginData = this.loginForm.value;
      this.auth.login(this.loginData.correo, this.loginData.contrasena).subscribe(async res => {
        console.log('Los datos', res);
        if (res) {
          this.log.logdataInfData(res).subscribe(resTk => {
            console.log("Mi token",resTk.confirmation_code);
            this.token = resTk.confirmation_code;
            if (this.token == null) {
              console.log(resTk.id);
              this.auth.gettokenDevice().then(DeviceTk => {
                this.log.saveDevice(resTk.id, DeviceTk).subscribe(deviceUpdate => {
                  console.log(deviceUpdate);
                });
              });
              this.inicializarFormulario();
              this.auth.getPrimeraVez().then(data => {
                if (data === 'true') {
                  this.route.navigateByUrl('/slides');
                } else if (data === 'false') {
                  this.route.navigateByUrl('/users/home');
                } else if (data === null) {
                  this.auth.setPrimeraVez();
                }
              });
            } else {
              this.mostrarmensaje('Verifique su correo', 'Error');
              this.route.navigateByUrl('/login');
            }
          });
         

        } else {
          this.mostrarmensaje('Ah ocurrido un error Intente más tarde o revise sus credenciales', 'Error');
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

  mostrarmensaje(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }
}

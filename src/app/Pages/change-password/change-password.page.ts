import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  message_header: string;
  form: FormGroup;
  submitted = false;
  passwordPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  showpassword = false;
  passwordToggleIcon = 'eye';
  showpasswordConfirm = false;
  passwordToggleIconConfirm = 'eye';
  usertk = null;

  constructor(
    private auth: AuthService,
    private log: LoginService,
    private snackbar: MatSnackBar,
    private loadingService: LoadingService,
    private sharedService: ShareserviceService,
    private route: Router 
  ) { }

  ngOnInit() {
    this.getDataInfo();
    this.getCurrentHour();
    this.loadForm();
  }

  getDataInfo() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
      });
    });
  }

  loadForm() {
    this.form = new FormGroup({
      password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(this.passwordPattern)]),
      password_confirmation: new FormControl('', [Validators.required]),
    },{ validators: this.matchingPasswords('password', 'password_confirmation')});
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

  changePassword() {
    if (!this.form.valid && this.usertk.id) {
      this.mostrarmensaje('Los datos ingresados no son validos', 'Error', 'red-snackbar');
      return false;
    } else {
      const password = this.form.value.password;
      const password_confirmation = this.form.value.password_confirmation;
      this.loadingService.loadingPresent({spinner: "circles" });
      this.sharedService.resetPassword(this.usertk.id,password,password_confirmation).subscribe(async res => {
        if (res) {
          this.loadingService.loadingDismiss();
          this.mostrarmensaje('La contraseña se ha cambiado exitosamente', 'OK', 'green-snackbar');
          this.loadForm();
          if(this.usertk.profile_id === null) {
            this.route.navigateByUrl('/slides');
          } else { 
            this.route.navigateByUrl('/users/home');
          }
        } else {
          this.loadingService.loadingDismiss();
          this.mostrarmensaje('El email no se encuentra registrado en el sistema', 'Error', 'red-snackbar');
        }
      }, error => {
        this.loadingService.loadingDismiss();
        this.mostrarmensaje('Error restableciendo la contraseña', 'Error', 'red-snackbar');
        this.auth.logout();
      });
    }
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

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}

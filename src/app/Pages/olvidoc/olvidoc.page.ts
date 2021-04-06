import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-olvidoc',
  templateUrl: './olvidoc.page.html',
  styleUrls: ['./olvidoc.page.scss'],
})
export class OlvidocPage implements OnInit {

  // ----------Pattern-----------
  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;

  correoForm: FormGroup;
  isSubmitted = false;

  constructor(
    private router: Router,
    private alertController:AlertController,
    private sharedService: ShareserviceService,
    private loadingService: LoadingService,
    private snackbar: MatSnackBar 
  ) { }

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.correoForm = new FormGroup({
      correo : new FormControl('',
      [Validators.required, Validators.min(7) , Validators.max(70), Validators.pattern(this.emailPattern)]),
    });
  }

  RecuperarEmail() {
    if (!this.correoForm.valid) {
      this.mostrarmensaje('Los datos ingresados no son validos', 'Error', 'red-snackbar');
      return false;
    } else {
      const email = this.correoForm.value;
      this.loadingService.loadingPresent({spinner: "circles" });
      this.sharedService.forgetPassword(email.correo).subscribe(async res => {
        if (res) {
          this.loadingService.loadingDismiss();
          this.presentAlert();
        } else {
          this.loadingService.loadingDismiss();
          this.mostrarmensaje('El email no se encuentra registrado en el sistema', 'Error', 'red-snackbar');
        }
      });
    }
  }

  volverLogin(){
    this.router.navigateByUrl('/');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambio Contraseña',
      subHeader: 'Cambio de contraseña',
      message: 'Por favor revisa tu correo para recuperar tu cuenta',
      buttons: ['OK']
    });

    await alert.present();
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}

import { AlertController } from '@ionic/angular';
import { Registro } from './../../_model/Registro';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

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
  nUsuario: Registro;

  constructor(
    private router: Router,
    private alertController:AlertController 
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

  RecuperarEmail(){
    this.nUsuario = this.correoForm.value;
    this.presentAlert();
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
}

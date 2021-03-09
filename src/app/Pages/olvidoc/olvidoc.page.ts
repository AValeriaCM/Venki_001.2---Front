import { AlertController } from '@ionic/angular';
import { Registro } from './../../_model/Registro';
import { RegistroService } from './../../_services/registro.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-olvidoc',
  templateUrl: './olvidoc.page.html',
  styleUrls: ['./olvidoc.page.scss'],
})
export class OlvidocPage implements OnInit {

  // ----------Pattern-----------

  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
  // ----------Pattern-----------

  correoForm: FormGroup;
  isSubmitted = false;
  nUsuario: Registro;

  constructor(private router: Router,
              private snackbar: MatSnackBar,
              private registro: RegistroService,
              private formBuilder: FormBuilder,
              private alertController:AlertController ) { }

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
    // servicio de recuperacion de contraseña  
    console.log(this.nUsuario);
    this.presentAlert();
    //volverLogin(); redireccion hacia el login 
  }

  volverLogin(){
    this.router.navigateByUrl('/');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambio Contraseña',
      subHeader: 'cambio de contraseña',
      message: 'por favor revise su correo para cambiar a contraseña.',
      buttons: ['OK']
    });

    await alert.present();
  }
}

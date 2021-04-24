import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-diagnostico-inicio',
  templateUrl: './diagnostico-inicio.page.html',
  styleUrls: ['./diagnostico-inicio.page.scss'],
})
export class DiagnosticoInicioPage implements OnInit {

  @ViewChild('videoDiagnosis', {static: false}) videoDiagnosis: ElementRef;

  alerta: any;
  informacion:any;
  categorias: any[] = [];
  cursos:any[] = [];
  token: any;

  constructor(
    private share: ShareserviceService,  
    public alertController: AlertController,
    private pObjecto: PassObjectService,
    private router: Router,
    private auth: AuthService
    ) {
      this.getToken();
    }

  ngOnInit() {
    this.informacion = this.pObjecto.getNavData(); 
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.alertAvisoGif();
      this.getcursos();
      this.getcategorias();
    });
  }

  async alertAvisoGif() {
    this.alerta = await this.alertController.create({
      cssClass: 'my-custombackInicio',
      header: 'Recomendaciones',
      message: `
      <br> 1. Seleccionar el puntaje o la respuesta correspondiente a la pregunta  
      <br> 2.  Deslizar hacia la derecha para continuar  
      <br> 3. No se guardara el progreso hasta contestar todas las preguntas de cada bloque`,
      buttons: [
        {
          text: '',
          cssClass: 'secondaryClose',
        }
      ],
    });
    await this.alerta.present();
  }

  async diagnosticoRedirect() {
    let video = this.videoDiagnosis.nativeElement;
    video.pause();
    this.pObjecto.setData(this.informacion);
    this.router.navigate(['/users/perfil/diagnostico']);
  }

  getcursos() {
    this.share.getCategorias(this.token).subscribe(info => {
      this.cursos = info.data;
    });
  }

  getcategorias() {
    this.share.getCategorias(this.token).subscribe(categ => {
      this.categorias = categ.data;
    });
  }

}

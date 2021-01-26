import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-diagnostico-inicio',
  templateUrl: './diagnostico-inicio.page.html',
  styleUrls: ['./diagnostico-inicio.page.scss'],
})
export class DiagnosticoInicioPage implements OnInit {
  alerta: any;
  informacion:any;
  categorias: any[] = [];
  cursos:any[] = [];

  constructor(private share: ShareserviceService,  
    public alertController: AlertController,
    private pObjecto: PassObjectService,
    private router: Router) { }

  ngOnInit() {
      this.informacion = this.pObjecto.getNavData();
      this.getcursos();
      this.getcategorias();
  }

  async alertAvisoGif() {
    this.alerta = await this.alertController.create({
      cssClass: 'my-custombackInicio',
      header: 'Recomendaciones',
      message: '<br> 1. Seleccionar el puntaje o la respuesta correspondiente a la pregunta  <br> 2.  Deslizar hacia la derecha para continuar  <br> 3. No se guardara el progreso hasta contestar todas las preguntas de cada ronda',
      buttons: [
        {
          text: '',
          cssClass: 'secondaryClose',
        }
      ],
    });
    await this.alerta.present();
  }

  async diagnosticoRedirect(){
    console.log(this.informacion);
    this.pObjecto.setData(this.informacion);
    this.router.navigate(['/users/perfil/diagnostico/']);
  }

  getcursos() {
    this.share.getCategorias().subscribe(info => {
      this.cursos = info.data;
      console.log(this.cursos);
    });
  }

  getcategorias() {
    this.share.getCategorias().subscribe(categ => {
      this.categorias = categ.data;
    });
  }

}

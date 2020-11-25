import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cursos-categorias',
  templateUrl: './cursos-categorias.page.html',
  styleUrls: ['./cursos-categorias.page.scss'],
})
export class CursosCategoriasPage implements OnInit {

  autoClose = true;
  progesoVal;
  usertk = null;
  userIDName: any; 
  coursetk: any;
  cursos: any[] = [];
  cursosUser: any[] = [];
  msj = [];
  alert: any;
  constructor(
    private router: Router,
    private share: ShareserviceService,
    private auth: AuthService,
    private previewAnyFile: PreviewAnyFile,
    private streaminmedia: StreamingMedia,
    private chatS: ChatServiceService,
    private pObjecto: PassObjectService,
    public alertController: AlertController,
    ) { }

  ngOnInit() {

    let informacion = this.pObjecto.getNavData();
    this.usertk = informacion.userInf;
    this.userIDName  = informacion.userInf.id;
    this.coursetk = informacion.infoCurso;
    this.getcursos(this.usertk.id, this.coursetk.id);
  }

  getcursos(userid: any, categoriaid: any) {
      console.log(userid,  categoriaid);
      this.share.getCursosCategorias(categoriaid, userid).subscribe(dataCurso => {
        this.cursosUser = dataCurso;
      });
  }

  openChat() {
    this.router.navigate(['/users/chat']);
  }

  verCurso(info: any) {
    let dataObj = {
      infoCurso: info,
      userInf: this.usertk,
      course: this.coursetk
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/entrena/vercurso/']);
  }

  agregarCurso(curso: any) {
    console.log('curso', curso.id);
    console.log('id_user', this.usertk.id);
    this.share.agregarCurso(this.usertk.id, curso.id).subscribe(data => {
          console.log(data);
    });

  }

  async alertDespuesTiempo() {
    this.alert = await this.alertController.create({
      header: 'UPS!',
      subHeader:
        'Ya tienes ese curso agregado prueba con otro',
      message:
        'No puedes agregar varias veces un mismo curso',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

}

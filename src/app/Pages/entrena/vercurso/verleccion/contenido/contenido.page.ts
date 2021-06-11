import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { PassNameLessonsService } from 'src/app/_services/pass-name-lessons.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit {

  token: any;
  index: number;
  user = null;
  id = null;
  course = null;

  informacion: any;
  leccion: number;
  order = 1;

  alert: any;

  constructor(
    private auth: AuthService,
    private pObjectIndex: PassNameLessonsService,
    private pObjecto: PassObjectService,
    private loadingService: LoadingService,
    private share: ShareserviceService,
    private router: Router,
    private alertController: AlertController
  ) { 
    this.getToken();
    this.reload();
  }

  ngOnInit() {
    this.leccion = this.pObjectIndex.getData();
    this.informacion = this.pObjecto.getNavData();
  }

  reload() {
    this.share.varorder.subscribe( res => {
      if(res) {
        this.share.verorder().then( order => {
          this.order = order + 1;
          this.share.updateorder(order);
        });
        this.loadPage();
      }
    });
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.loadPage();
    });
  }

  loadPage() {
    this.index = this.pObjectIndex.getData();
    const informacion = this.pObjecto.getNavData();
    this.user = informacion.userInf;
    this.id = informacion.infoCurso.id;
    this.share.guardarCursoActiva(informacion);
    this.getCourse();
  }

  getCourse() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCursosUsuario(this.user.id, this.token).subscribe( resp => {
      this.loadingService.loadingDismiss();
      let course = resp.data.find( (course: any) => course.id === this.id );
      this.course = course.lessons[this.index];
      const nextResource = this.course.resources.find( (resource: any) => resource.order === this.order );

      if(nextResource) {
        this.pObjectIndex.setData(this.leccion);
        this.pObjecto.setData(this.informacion);
  
        if(nextResource.audio) {
          this.router.navigate(['/users/entrena/vercurso/verleccion/audio']);
        } 
  
        if(nextResource.document) {
          this.router.navigate(['/users/entrena/vercurso/verleccion/texto']);
        }
  
        if(nextResource.video) {
          this.router.navigate(['/users/entrena/vercurso/verleccion/video']);
        }
      } else {
        this.alertProgreso();
        this.router.navigateByUrl('/users/entrena/vercurso');
      }
    });
  }

  async alertProgreso() {
    this.alert = await this.alertController.create({
      header: 'Felicidades',
      subHeader:
        'Terminaste la lección',
      message:
        'Pasa a la siguiente lección para incrementar tu progreso',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }
}

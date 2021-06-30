import { PassObjectAuxService } from './../../../../_services/pass-object-aux.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { PassNameLessonsService } from 'src/app/_services/pass-name-lessons.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-verleccion',
  templateUrl: './verleccion.page.html',
  styleUrls: ['./verleccion.page.scss'],
})
export class VerleccionPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  data: any;
  userinfo: any;
  course: any;
  courseID: any;
  color: string;
  index: number;
  token: any;
  curso = null;
  informacion:any;
  leccion: number;
  
  constructor(
    private router: Router,
    private share: ShareserviceService,
    public alertController: AlertController,
    private pObjecto: PassObjectService,
    private pObjecAux: PassObjectAuxService,
    private pObjectIndex: PassNameLessonsService,
    private loadingService: LoadingService,
    private auth: AuthService
    ) { 
      this.getToken();
    }

  ngOnInit() {
    this.leccion = this.pObjectIndex.getData();
    this.informacion = this.pObjecto.getNavData();
    this.share.updateorder(1);
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
    this.color = informacion.color;
    this.data = informacion.infoCurso;
    this.userinfo = informacion.userInf;
    this.course = informacion.course.name;
    this.courseID = informacion.infoCurso.id;
    this.share.guardarCursoActiva(informacion);
    this.getCourse();

  }

  goContent() {
    this.pObjectIndex.setData(this.leccion);
    this.pObjecto.setData(this.informacion);
    this.share.updateorder(0);
    this.router.navigate(['/users/entrena/vercurso/verleccion/contenido']);
  }

  getCourse() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.share.getCursosUsuario(this.userinfo.id, this.token).subscribe( resp => {
      this.loadingService.loadingDismiss();
      let course = resp.data.find( (course: any) => course.id === this.courseID );
      this.curso = course.lessons[this.index];
    });
  }

  volver() {
    this.pObjecto.setData(this.pObjecAux.getNavData());
    this.router.navigate(['/users/entrena/vercurso']);
  }
}

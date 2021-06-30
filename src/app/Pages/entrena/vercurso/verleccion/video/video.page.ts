import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { PassNameLessonsService } from 'src/app/_services/pass-name-lessons.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {

  token = null;
  index = null;
  user = null;
  id = null;
  course = null;
  video = null;

  informacion: any;
  leccion: number;
  order = null;

  constructor(
    private auth: AuthService,
    private pObjectIndex: PassNameLessonsService,
    private pObjecto: PassObjectService,
    private loadingService: LoadingService,
    private share: ShareserviceService,
    private router: Router
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.leccion = this.pObjectIndex.getData();
    this.informacion = this.pObjecto.getNavData();
    this.share.verorder().then( order => {
      this.order = order;
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
      const resource = this.course.resources.find( (resource: any) => resource.order === this.order );
      this.video = resource.video;
    });
  }

  goContent() {
    this.pObjectIndex.setData(this.leccion);
    this.pObjecto.setData(this.informacion);
    this.share.varorder.next('true');
    this.router.navigate(['/users/entrena/vercurso/verleccion/contenido']);
  }

}

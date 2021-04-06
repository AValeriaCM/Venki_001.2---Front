import { Component, OnInit } from '@angular/core';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-cursos-general',
  templateUrl: './cursos-general.page.html',
  styleUrls: ['./cursos-general.page.scss'],
})
export class CursosGeneralPage implements OnInit {

  cursos;
  data: any;
  prueba: any;
  token: any;

  constructor(
    private share: ShareserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
    ) {
      this.route.queryParams.subscribe( params => {
        if ( params && params.info) {
          this.data = params.info;
        }
      });
      this.getToken();
    }

  ngOnInit() {}

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp
      this.prueba = JSON.parse(this.data);
      this.share.getCursos(this.token).subscribe( info => {
        this.cursos = info.data;
      });
    });
  }

  verCurso(info: any){
    let NavigationExtras: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(info.id),
      }
    };
    this.router.navigate(['/users/perfil/vercursos-general/'], NavigationExtras);
  }

  agregarCurso(curso: any){
    this.share.agregarCurso(this.prueba, curso.id, this.token).subscribe( data =>  {
    });
  }
}

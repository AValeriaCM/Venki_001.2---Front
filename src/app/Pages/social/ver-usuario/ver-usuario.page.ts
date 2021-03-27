import { Component, OnInit } from '@angular/core';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.page.html',
  styleUrls: ['./ver-usuario.page.scss'],
})
export class VerUsuarioPage implements OnInit {

  usuario: any;
  cursos = [];
  constructor(
    private pObjecto: PassObjectService,
    private share: ShareserviceService,
    private router: Router
  ) { }

  ngOnInit() {
    let data = this.pObjecto.getNavData();
    if(data) {
      this.usuario = data.userinfo;
      this.share.getCursosUsuario(this.usuario.id).subscribe( info => {
        this.cursos = info.data;
      });
    }
  }

  volver() {
    if(this.usuario) {
      this.router.navigate(['/users/social']);
    } else {
      this.router.navigate(['/users/home']);
    }
  }
}

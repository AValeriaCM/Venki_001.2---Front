import { Cursos } from './../../../_model/Cursos';
import { Component, OnInit } from '@angular/core';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.page.html',
  styleUrls: ['./ver-usuario.page.scss'],
})
export class VerUsuarioPage implements OnInit {

  usuario;
  cursos: any;
  constructor(
    private pObjecto: PassObjectService,
    private share: ShareserviceService
  ) { }

  ngOnInit() {
    let data = this.pObjecto.getNavData();
    console.log('data recivida',  data);
    this.usuario = data.userinfo;
    console.log('soy el suaurio final', this.usuario);
    this.share.getCursosUsuario(this.usuario.id).subscribe( info => {
      this.cursos = info.data;
    });
  }


}

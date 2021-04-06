import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-vercursos-general',
  templateUrl: './vercursos-general.page.html',
  styleUrls: ['./vercursos-general.page.scss'],
})
export class VercursosGeneralPage implements OnInit {

  data: any;
  prueba: any;
  info;
  token: any;

  constructor(
    private route: ActivatedRoute, 
    private share: ShareserviceService,
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
      this.share.getCursoEspecifico(this.prueba, this.token).subscribe( async infodt => {
        this.info = infodt.data;
      });
    });
  }
}

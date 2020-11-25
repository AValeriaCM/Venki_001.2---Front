import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private route: ActivatedRoute, private router: Router, private share: ShareserviceService) {
    this.route.queryParams.subscribe( params => {
      if ( params && params.info) {
        this.data = params.info;
      }
    });
  }

  ngOnInit() {
    this.prueba = JSON.parse(this.data);
    this.share.getCursoEspecifico(this.prueba).subscribe( async infodt => {
      this.info = infodt.data;
    });
  }


}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-vidplayer',
  templateUrl: './vidplayer.page.html',
  styleUrls: ['./vidplayer.page.scss'],
})


export class VidplayerPage implements OnInit {

  data: any;
  vid: Array<any>;
  orderID: any;
  tam: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pObjecto: PassObjectService,
    private share: ShareserviceService) {
  }

  ngOnInit() {
    let info = this.pObjecto.getNavData();
    console.log(info);
    this.share.guardarLeccionActiva(info);
    this.data = info.vidInfo;
    this.orderID = info.orderid;
    this.tam = info.tm;
    this.vid = [];
    this.vid.push(this.data);
    this.share.verorder().then( rval => {
      if (rval === this.tam){
        this.share.varExam.next('Listo para el examen');
      }else{
        this.share.updateorder(this.orderID);
      }
    });
  }

}

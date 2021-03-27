import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
})
export class RecomendacionesPage implements OnInit {

  usertk: any;
  panelOpenState = false;
  recomen: any;
  constructor(
    private router: Router,
    private auth: AuthService,
    private log: LoginService,
    private  share: ShareserviceService
  ) { }

  ngOnInit() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        this.share.getrecomendation(infoUser.id).subscribe( res => {
          this.recomen  = res.data.courses;
        });
      });
    });
  }

  hacerpremium(){
    let num = 1;
    this.share.editpremium( num , this.usertk.id ).subscribe( res => {
      this.share.var.next('update');
      this.router.navigate(['/users/perfil']);
    });
  }

}

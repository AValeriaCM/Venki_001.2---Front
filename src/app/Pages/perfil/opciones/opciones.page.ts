import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/_model/Login';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.page.html',
  styleUrls: ['./opciones.page.scss'],
})
export class OpcionesPage implements OnInit {

  usertk;
  constructor(
    private router: Router,
    private auth: AuthService,
    private log: LoginService,
    private share: ShareserviceService) { }

  ngOnInit() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
      });
    });

  }


  editNew(){
    let surveyedNum = 0;
    this.share.editvolverestadoBasico(surveyedNum, this.usertk.id).subscribe( res => {
      this.share.var.next('update');
      this.router.navigate(['/users/perfil']);
    });

  }


  logout(){
    this.auth.logout();
  }

}

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertController } from '@ionic/angular';
import { PerfilesService } from 'src/app/_services/perfiles.service';
import { LoginService } from 'src/app/_services/login.service';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  image: 'https://via.placeholder.com/150';
  data: any;
  alert: any;
  valorChange: any;
  mensaje: any;
  select  =  false;
  userInf: any;

  constructor(
    private router: Router,
    private auth: AuthService,
    public alertController: AlertController,
    private porfiles: PerfilesService,
    private log: LoginService) {}

  ngOnInit() {
    this.porfiles.getProfiles().subscribe( (profi: any) => {
      console.log(profi);
      this.data = profi.data.map( value => {
        value.selected  = false;
        return value;
      });
      console.log(this.data,'dta slides');
      this.auth.gettokenLog().then( tkInf => {
        if (tkInf !==  null){
          this.log.logdataInfData(tkInf).subscribe( resTk => {
            if (resTk){
              this.userInf = resTk;
            }else {
              console.log('falle');
            }
          });
        }else{
          console.log('falle');
        }
      });
    });

  }

  obtenerVal(value: any){

    this.valorChange = value;
    if (this.data.length > 0) {
      this.data.filter(r => r.id !== value.id).forEach(r => {
        r.selected = false;
      });
    }
  }


  continuar(){
    console.log(this.valorChange);
    if (this.valorChange !== undefined) {
      console.log(this.userInf.id, this.valorChange.id);
      this.porfiles.updateProfile(this.userInf.id, this.valorChange.id).subscribe( profileUpdate => {
        console.log(profileUpdate);
        this.auth.setNomolestarP();
        this.router.navigateByUrl('/users/home');
      });
    }else {
      this.alertDespuesTiempo();
    }
  }

  async alertDespuesTiempo() {
    this.mensaje = 'Debe seleccionar Un perfil';
  }
}

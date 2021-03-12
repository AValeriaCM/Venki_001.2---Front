import { UsuariosF } from './../../../_model/_Usuario';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { Router } from '@angular/router';
import { LoginService } from './../../../_services/login.service';
import { AuthService } from './../../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';  


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {

  urlImg1: string = "avatar-nuts1";
  urlImg2: string = "avatar-nuts2";
  urlImg3: string = "avatar-nuts3";
  urlImg4: string = "avatar-nuts4";
  urlImg5: string = "avatar-nuts5";
  urlImg6: string = "avatar-nuts6";
  idUser:number;
  user: UsuariosF;

  constructor(private popover:PopoverController,
              private auth: AuthService,
              private log: LoginService,
              private share: ShareserviceService,
              private router: Router){} 
  
  ngOnInit() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.idUser = infoUser.id;
        console.log('id user:',this.idUser);
   
      });
    });
  }

  ClosePopover()
  {
    this.popover.dismiss();
  }

  cambiarAvatar( urlImagen:string){
    this.user = new UsuariosF;
    if(urlImagen){
    console.log('llega Avatar', urlImagen, this.idUser);
    //servicio para actualizar avatar.
    this.user.id = this.idUser;
    this.user.avatar = urlImagen;
    this.share.actualizarPhoto(this.idUser,this.user.avatar).subscribe(()=> {

    });
    this.ClosePopover();
    //this.router.navigateByUrl('/users/perfil'); renderizar para ver actualizacion
    }
  }
} 



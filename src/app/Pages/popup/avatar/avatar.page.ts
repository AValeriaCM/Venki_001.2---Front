import { UsuariosF } from './../../../_model/_Usuario';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
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

  avatars = [
    {
      'name': "Gimnasta",
      'photo': "avatar-nuts1"
    },
    {
      'name': "Gimnasta",
      'photo': "avatar-nuts2"
    },
    {
      'name': "Ciclista",
      'photo': "avatar-nuts3"
    },
    {
      'name': "Basquetbolista",
      'photo': "basketball-player"
    },
    {
      'name': "Boxeador",
      'photo': "boxer"
    },
    {
      'name': "Buceador",
      'photo': "diver"
    },
    {
      'name': "Futbolista",
      'photo': "football"
    },
    {
      'name': "Ping Pong",
      'photo': "ping-pong"
    },
    {
      'name': "Rugby",
      'photo': "rugby"
    },
    {
      'name': "Esquiador",
      'photo': "skier"
    },
    {
      'name': "Nadador",
      'photo': "swimmer"
    },
    {
      'name': "Tenista",
      'photo': "tennis"
    },
    {
      'name': "Tenista",
      'photo': "tennis-player"
    }
  ]

  idUser:number;
  user: UsuariosF;

  constructor(
    private popover:PopoverController,
    private auth: AuthService,
    private log: LoginService,
    private share: ShareserviceService
  ){} 
  
  ngOnInit() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.idUser = infoUser.id;   
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
    this.user.id = this.idUser;
    this.user.avatar = urlImagen;
    this.share.actualizarAvatar(this.idUser,this.user).subscribe(()=> {

    });
    this.ClosePopover();
    }
  }
} 



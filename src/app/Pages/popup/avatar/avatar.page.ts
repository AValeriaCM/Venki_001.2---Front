import { UsuariosF } from './../../../_model/_Usuario';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { LoginService } from './../../../_services/login.service';
import { AuthService } from './../../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';  
import { LoadingService } from 'src/app/_services/loading.service';


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
    },
    {
      'name': "Tenista",
      'photo': "football_women"
    },
    {
      'name': "Tenista",
      'photo': "bowling"
    },
    {
      'name': "Tenista",
      'photo': "hockey"
    },
    {
      'name': "Tenista",
      'photo': "surfer"
    },
    {
      'name': "fencing",
      'photo': "fencing"
    },
    {
      'name': "fencing",
      'photo': "martial-art"
    },
    {
      'name': "fencing",
      'photo': "rhythmic-gymnastics"
    },
    {
      'name': "baseball",
      'photo': "baseball"
    }
  ]

  idUser:number;
  user: UsuariosF;
  token: any;

  constructor(
    private popover:PopoverController,
    private auth: AuthService,
    private log: LoginService,
    private share: ShareserviceService,
    private loadingService: LoadingService
  ){
    this.getToken();
  } 
  
  ngOnInit() {
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.auth.gettokenLog().then( dt => {
        this.log.logdataInfData(dt).subscribe( infoUser => {
          this.idUser = infoUser.id;   
        });
      });
    });
  }

  ClosePopover()
  {
    this.popover.dismiss();
  }

  cambiarAvatar( urlImagen:string){
    this.user = new UsuariosF;
    if(urlImagen) {
      this.loadingService.loadingPresent({spinner: "circles" });
      this.user.id = this.idUser;
      this.user.avatar = urlImagen;
      this.share.actualizarAvatar(this.idUser,this.user, this.token).subscribe(()=> {
        this.loadingService.loadingDismiss();      
      }, error => {
        this.loadingService.loadingDismiss();
      });
      this.ClosePopover();
    }
  }
} 



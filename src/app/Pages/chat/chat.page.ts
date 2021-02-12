import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  userList: any[] = [];
  data: Array<any>;
  textoBuscar = '';
  correoUser;
  searhVariable: string;
  idUser: any;
  nameUser: any;
  userTk = null;

  constructor(
    private router: Router,
    private chatS: ChatServiceService,
    private auth: AuthService,
    private log: LoginService,
    private pObjecto: PassObjectService) {
    }

  ngOnInit() {
    this.data = [];
    this.userList = [];
    this.auth.gettokenLog().then( tkInf => {
      this.userTk = tkInf;
      this.log.logdataInfData(tkInf).subscribe( resTk => {
        this.idUser = resTk.id;
        this.nameUser = resTk.name;
        this.chatS.getchatsUser(this.idUser).subscribe((chatData: any)  => {
          console.log('data',chatData);
          this.userList  = chatData.data;
          console.log(this.userList);
        });
      });
    });

    this.chatS.var.subscribe( res => {
      this.auth.gettokenLog().then( tkInf => {
        this.log.logdataInfData(tkInf).subscribe( resTk => {
          this.idUser = resTk.id;
          this.nameUser = resTk.name;
          this.chatS.getchatsUser(this.idUser).subscribe((chatData: any)  => {
            this.userList  = chatData.data;
          });
        });
      });
    });
    this.chatS.removeNotification();
    this.chatS.var.next('token remove');
    console.log('lo que trae userlist', this.userList);

  }

  buscar(event){
    this.textoBuscar = event.detail.value;
    this.chatS.getAllUsers(this.textoBuscar).subscribe( allUser => {
      let result = allUser.data;
      if (result.length > 0){
        console.log(allUser);
        this.data = allUser.data;
        this.searhVariable = '';
        this.chatS.var.next('User find');
      }
    });
  }

  abrirDialogo(info: any){
    this.data = [];
    let dataObj = {
      infoDt :  info,
      transferID : this.idUser,
      useractual : this.nameUser
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/chat/enviomsj/']);
  }

  abrirMensajesBusqueda(info: any){
    this.data = [];
    const dataObj = {
      infoDt :  info,
      transferID : this.idUser,
      useractual : this.nameUser
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/chat/mensaje-busqueda/']);
  }

  verUser(userdt: any){
    console.log('user enviado', userdt);
    const dataObj = {
      userinfo: userdt
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/social/ver-usuario/']);
  }

  volverHome(){
    this.router.navigate(['/users/home/']);
  }
}

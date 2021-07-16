import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  userList: any[] = [];
  data: Array<any>;
  textoBuscar = '';
  searhVariable: string;
  idUser: any;
  nameUser: any;
  userTk = null;
  filterList = '';
  notifications = false;
  token: any;
  message_header: string;

  constructor(
    private router: Router,
    private chatS: ChatServiceService,
    private auth: AuthService,
    private log: LoginService,
    private pObjecto: PassObjectService,
    private loadingService: LoadingService
    ) {
      this.textoBuscar = '';
      this.filterList = '';
      this.getToken();
      this.getCurrentHour();
  }

  ngOnInit() {
    this.data = [];
    this.userList = [];
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.getUserAuth();
      this.chatS.removeNotification();
      this.chatS.var.next('token remove');
    });
  }

  getCurrentHour() {
    var today = new Date()
    var curHr = today.getHours()
    if (curHr < 12) {
      this.message_header = "Buenos días";
    } else if (curHr < 18) {
      this.message_header = "Buenas tardes";
    } else {
      this.message_header = "Buenas noches";
    }
  }

  getUserAuth() {
    this.auth.gettokenLog().then( tkInf => {
      this.userTk = tkInf;
      this.loadingService.loadingPresent({spinner: "circles" });
      this.log.logdataInfData(tkInf).subscribe( resTk => {
        this.loadingService.loadingDismiss();
        this.idUser = resTk.id;
        this.nameUser = resTk.name;
        this.getUsersChats();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  getUsersChats() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.chatS.getchatsUser(this.idUser, this.token).subscribe((chatData: any)  => {
      chatData.data.map( (chat: any) => {
        if(chat.receiver_id === this.idUser) {
          chat.usuario = chat.transmitter;
        } else {
          chat.usuario = chat.receiver;
        }
        chat.messagesReceptor = chat.messages.filter( (mess: any) => mess.user_id !== this.idUser);
        this.userList.push(chat);
      });
      this.userList = this.userList.sort((a: any,b: any) => {
        if(a.messagesReceptor.length > 0 && b.messagesReceptor.length > 0 ) {
          return 0 - ( (new Date(a.messagesReceptor[a.messagesReceptor.length-1].updated_at)).getTime() < (new Date(b.messagesReceptor[b.messagesReceptor.length-1].updated_at)).getTime() ? -1 : 1)
        }
      });
      this.loadingService.loadingDismiss();
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  buscar(event: any) {
    this.filterList = '';
    this.textoBuscar = event.detail.value;
    if(this.textoBuscar != '') {
      this.loadingService.loadingPresent({spinner: "circles" });
      this.chatS.getAllUsers(this.textoBuscar, this.token).subscribe( allUser => {
        if(allUser.data.length > 0) {
          this.data = allUser.data.filter( (user: any) => user.id !== this.idUser);
          this.chatS.var.next('User find');
        }
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    } else {
      this.data = [];
    }
  }
  
  closeSearch() {
    this.textoBuscar = '';
    this.filterList = '';
    this.data = []; 
  }

  selectedIndexChange(index: number) {
    if( index === 0) {
      this.notifications = false;
    } else {
      this.notifications = true;
      this.closeSearch();
    }
  }

  abrirDialogo(info: any) {
    this.data = []; 
    let dataObj = {
      infoDt :  info,
      transferID : this.idUser,
      useractual : this.nameUser
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/chat/enviomsj']);
  }

  abrirMensajesBusqueda(info: any) {
    this.data = [];
    const dataObj = {
      infoDt :  info,
      transferID : this.idUser,
      useractual : this.nameUser
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/chat/mensaje-busqueda']);
  }
}

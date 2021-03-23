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
  searchActive = false;
  notifications = false;

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
  }

  ngOnInit() {
    this.data = [];
    this.userList = [];
    this.getUserAuth();
    this.chatS.removeNotification();
    this.chatS.var.next('token remove');
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
    this.chatS.getchatsUser(this.idUser).subscribe((chatData: any)  => {
      var chats = chatData.data.filter( (user: any) => user.receiver.id !== this.idUser);
      chats.map( (chat: any) => {
        const message = chat;
        message.messagesReceptor = chat.messages.filter( (mess: any) => mess.user_id !== this.idUser);
        this.userList.push(message);
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
      this.chatS.getAllUsers(this.textoBuscar).subscribe( allUser => {
        if(allUser.data.length > 0) {
          const users = this.validateUsers(allUser.data); 
          this.data = users.filter( (user: any) => user.id !== this.idUser);
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

  validateUsers(users: any) {
    const listUsers = [];
    users.map( (user: any) => {
      const exist = this.userList.find( (o: any) => o.receiver.id === user.id);
      if(!exist) {
        listUsers.push(user);
      } else {
        this.filterList = exist.receiver.name;
      } 
    });
    return listUsers;
  } 

  openSearch() {
    if(!this.notifications) {
      this.searchActive = true
    }
  }

  closeSearch() {
    this.searchActive = false;
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

  abrirDialogo(info: any){
    this.data = [];
    let dataObj = {
      infoDt :  info,
      transferID : this.idUser,
      useractual : this.nameUser
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/chat/enviomsj']);
  }

  abrirMensajesBusqueda(info: any){
    this.data = [];
    const dataObj = {
      infoDt :  info,
      transferID : this.idUser,
      useractual : this.nameUser
    };
    this.pObjecto.setData(dataObj);
    this.router.navigate(['/users/chat/mensaje-busqueda']);
  }

  volverHome() {
    this.router.navigate(['/users/home']);
  }
}
